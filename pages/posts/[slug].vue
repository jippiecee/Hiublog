<script setup lang="ts">
import { marked } from 'marked'
const db = useSupabaseClient<any>()
const slug = useRoute().params.slug as string
const { data: post } = await useAsyncData(`post-${slug}`, async () => {
  const { data } = await db.from('posts').select('*').eq('slug', slug).maybeSingle()
  return data
})
if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Tulisan tidak ditemukan', fatal: true })

// Render markdown + bikin daftar isi dari heading H2/H3
const parsed = computed(() => {
  const toc: { id: string; text: string; level: number }[] = []
  const used = new Set<string>()
  const raw = marked.parse(post.value.content || '') as string
  const html = raw.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl, inner) => {
    const text = inner.replace(/<[^>]+>/g, '')
    const base = slugify(text.replace(/&[a-z#0-9]+;/gi, ' ')) || 'bagian'
    let id = base, n = 2
    while (used.has(id)) id = `${base}-${n++}`
    used.add(id)
    toc.push({ id, text: inner, level: Number(lvl) })
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`
  })
  return { html, toc }
})

// Related posts: paling banyak tag yang sama, kalau nggak ada pakai yang terbaru
const { data: related } = await useAsyncData(`related-${slug}`, async () => {
  const { data } = await db.from('posts').select('*')
    .eq('status', 'published').lte('published_at', new Date().toISOString())
    .neq('id', post.value.id).order('published_at', { ascending: false }).limit(30)
  const mine: string[] = post.value.tags ?? []
  return (data ?? [])
    .map((p: any) => ({ p, score: (p.tags ?? []).filter((t: string) => mine.includes(t)).length }))
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 2)
    .map((x: any) => x.p)
})

// Progress bar baca
const pct = ref(0)
const onScroll = () => { const d = document.documentElement; pct.value = Math.min(1, d.scrollTop / ((d.scrollHeight - d.clientHeight) || 1)) }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

useHead({ title: `${post.value.title} · HiuBlog` })
useSeoMeta({ description: post.value.excerpt, ogTitle: post.value.title })
</script>
<template>
  <article class="mx-auto max-w-3xl px-5 py-14">
    <div class="fixed inset-x-0 top-16 z-30 h-0.5 origin-left bg-primary" :style="{ transform: 'scaleX(' + pct + ')' }" />
    <NuxtLink to="/" class="text-sm text-muted hover:text-primary">← Semua tulisan</NuxtLink>
    <h1 class="mt-6 font-serif text-4xl md:text-5xl font-semibold leading-tight">{{ post.title }}</h1>
    <p class="mt-4 text-sm text-muted">{{ fmtDate(post.published_at) }} · {{ readTime(post.content) }} menit baca</p>
    <div class="mt-4 flex flex-wrap gap-1.5">
      <NuxtLink v-for="t in post.tags" :key="t" :to="{ path: '/', query: { tag: t } }" class="rounded-full bg-surface2 px-2.5 py-0.5 text-xs text-muted hover:text-primary">{{ t }}</NuxtLink>
    </div>

    <!-- Daftar isi (muncul kalau ada 3 heading atau lebih) -->
    <nav v-if="parsed.toc.length >= 3" class="mt-8 rounded-2xl border border-line bg-surface p-5" aria-label="Daftar isi">
      <details open>
        <summary class="cursor-pointer text-sm font-bold">Daftar isi</summary>
        <ul class="mt-3 space-y-1">
          <li v-for="h in parsed.toc" :key="h.id" :class="h.level === 3 ? 'pl-4' : ''">
            <a :href="`#${h.id}`" class="block py-1 text-sm text-muted hover:text-primary" v-html="h.text" />
          </li>
        </ul>
      </details>
    </nav>

    <div class="prose-hiu mt-10 [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24" v-html="parsed.html" />

    <!-- Related posts -->
    <section v-if="related?.length" class="mt-16 border-t border-line pt-10">
      <h2 class="font-serif text-2xl">Tulisan lain buat dibaca</h2>
      <div class="mt-5 grid gap-5 sm:grid-cols-2">
        <PostCard v-for="p in related" :key="p.id" :post="p" />
      </div>
    </section>

    <MessageForm :post-id="post.id" />
  </article>
</template>