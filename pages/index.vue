<script setup lang="ts">
const db = useSupabaseClient<any>()
const route = useRoute()
const PER_PAGE = 6

const { data: posts } = await useAsyncData('posts', async () => {
  const { data } = await db.from('posts').select('*')
    .eq('status', 'published').lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
  return data ?? []
})

const tags = computed(() => [...new Set((posts.value ?? []).flatMap((p: any) => p.tags ?? []))])
const active = computed(() => (route.query.tag as string) || '')
const page = computed(() => Math.max(1, parseInt(route.query.page as string) || 1))
const list = computed(() => (posts.value ?? []).filter((p: any) => !active.value || p.tags?.includes(active.value)))

// Post terbaru jadi kartu besar hanya di halaman 1 saat tidak ada filter tag
const lead = computed(() => (active.value ? null : list.value[0] ?? null))
const items = computed(() => (lead.value ? list.value.slice(1) : list.value))
const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / PER_PAGE)))
const current = computed(() => Math.min(page.value, totalPages.value))
const paged = computed(() => items.value.slice((current.value - 1) * PER_PAGE, current.value * PER_PAGE))
const showLead = computed(() => !!lead.value && current.value === 1)

const pageList = computed(() => {
  const t = totalPages.value, c = current.value
  const nums = [...new Set([1, t, c - 1, c, c + 1].filter((n) => n >= 1 && n <= t))].sort((a, b) => a - b)
  const out: (number | string)[] = []
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push(`gap${i}`); out.push(n) })
  return out
})
const pageTo = (n: number) => ({ path: '/', query: { ...route.query, page: n > 1 ? n : undefined } })

const listEl = ref<HTMLElement | null>(null)
watch(() => route.query.page, () => nextTick(() => listEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })))

useHead({ title: 'HiuBlog · Catatan belajar harian' })
</script>
<template>
  <div class="mx-auto max-w-6xl px-5 py-14">
    <section class="max-w-3xl">
      <h1 class="font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight">Hal yang gua pelajari, temuin, dan akhirnya ngerti hari ini.</h1>
      <p class="mt-5 text-lg text-muted max-w-xl">Apa yang gua alami, pelajari, tonton, baca, dan pikirin hari ini, dari mana pun gua lagi berada. Ditulis buat melatih menulis, dibaca siapa aja..</p>
    </section>

    <NuxtLink v-if="showLead" :to="`/posts/${lead.slug}`" class="group mt-12 block rounded-3xl border border-line bg-surface p-7 md:p-10 transition hover:border-primary">
      <span class="rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">Terbaru</span>
      <h2 class="mt-4 font-serif text-3xl md:text-4xl leading-tight group-hover:text-primary">{{ lead.title }}</h2>
      <p class="mt-3 max-w-2xl text-muted leading-relaxed">{{ lead.excerpt }}</p>
      <p class="mt-5 text-sm text-muted">{{ fmtDate(lead.published_at) }} · {{ readTime(lead.content) }} menit baca</p>
    </NuxtLink>

    <section ref="listEl" class="mt-12 scroll-mt-24">
      <div v-if="tags.length" class="flex gap-2 overflow-x-auto pb-3">
        <NuxtLink to="/" class="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold" :class="!active ? 'bg-primary text-on-primary' : 'bg-surface2 text-muted hover:text-ink'">Semua</NuxtLink>
        <NuxtLink v-for="t in tags" :key="t" :to="{ path: '/', query: { tag: t } }" class="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold" :class="active === t ? 'bg-primary text-on-primary' : 'bg-surface2 text-muted hover:text-ink'">{{ t }}</NuxtLink>
      </div>

      <div class="mt-4 grid gap-5 md:grid-cols-2">
        <PostCard v-for="p in paged" :key="p.id" :post="p" />
      </div>
      <p v-if="!list.length" class="mt-10 text-muted">Belum ada tulisan yang tayang. Cek lagi nanti ya.</p>

      <nav v-if="totalPages > 1" class="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Halaman">
        <NuxtLink v-if="current > 1" :to="pageTo(current - 1)" class="btn btn-ghost" aria-label="Halaman sebelumnya">←<span class="hidden sm:inline"> Sebelumnya</span></NuxtLink>
        <template v-for="n in pageList" :key="n">
          <span v-if="typeof n === 'string'" class="px-1 text-muted">…</span>
          <NuxtLink v-else :to="pageTo(n)" class="btn min-w-10" :class="n === current ? 'btn-primary' : 'btn-ghost'" :aria-current="n === current ? 'page' : undefined">{{ n }}</NuxtLink>
        </template>
        <NuxtLink v-if="current < totalPages" :to="pageTo(current + 1)" class="btn btn-ghost" aria-label="Halaman berikutnya"><span class="hidden sm:inline">Berikutnya </span>→</NuxtLink>
      </nav>
    </section>
  </div>
</template>