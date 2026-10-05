<script setup lang="ts">
const db = useSupabaseClient<any>()
const route = useRoute()
const { data: posts } = await useAsyncData('posts', async () => {
  const { data } = await db.from('posts').select('*')
    .eq('status', 'published').lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
  return data ?? []
})
const tags = computed(() => [...new Set((posts.value ?? []).flatMap((p: any) => p.tags ?? []))])
const active = computed(() => (route.query.tag as string) || '')
const list = computed(() => (posts.value ?? []).filter((p: any) => !active.value || p.tags?.includes(active.value)))
const featured = computed(() => (active.value ? null : list.value[0]))
const rest = computed(() => (featured.value ? list.value.slice(1) : list.value))
useHead({ title: 'HiuBlog · Catatan belajar harian' })
</script>
<template>
  <div class="mx-auto max-w-6xl px-5 py-14">
    <section class="max-w-3xl">
      <h1 class="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight">Hal yang gue pelajari, temuin, dan akhirnya ngerti hari ini.</h1>
      <p class="mt-5 text-lg text-muted max-w-xl">Apa yang gue alami, pelajari, tonton, baca, dan pikirin hari ini, dari mana pun gue lagi berada. Ditulis buat melatih menulis, dibaca siapa aja..</p>
    </section>

    <NuxtLink v-if="featured" :to="`/posts/${featured.slug}`" class="group mt-12 block rounded-3xl border border-line bg-surface p-7 md:p-10 transition hover:border-primary">
      <span class="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">Terbaru</span>
      <h2 class="mt-4 font-serif text-3xl md:text-4xl leading-tight group-hover:text-primary">{{ featured.title }}</h2>
      <p class="mt-3 max-w-2xl text-muted leading-relaxed">{{ featured.excerpt }}</p>
      <p class="mt-5 text-sm text-muted">{{ fmtDate(featured.published_at) }} · {{ readTime(featured.content) }} menit baca</p>
    </NuxtLink>

    <section class="mt-12">
      <div v-if="tags.length" class="flex gap-2 overflow-x-auto pb-3">
        <NuxtLink to="/" class="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold" :class="!active ? 'bg-primary text-on-primary' : 'bg-surface2 text-muted hover:text-ink'">Semua</NuxtLink>
        <NuxtLink v-for="t in tags" :key="t" :to="{ path: '/', query: { tag: t } }" class="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold" :class="active === t ? 'bg-primary text-on-primary' : 'bg-surface2 text-muted hover:text-ink'">{{ t }}</NuxtLink>
      </div>
      <div class="mt-4 grid gap-5 md:grid-cols-2">
        <PostCard v-for="p in rest" :key="p.id" :post="p" />
      </div>
      <p v-if="!list.length" class="mt-10 text-muted">Belum ada tulisan yang tayang. Cek lagi nanti ya.</p>
    </section>
  </div>
</template>