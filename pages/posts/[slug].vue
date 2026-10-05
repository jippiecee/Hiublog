<script setup lang="ts">
import { marked } from 'marked'
const db = useSupabaseClient<any>()
const slug = useRoute().params.slug as string
const { data: post } = await useAsyncData(`post-${slug}`, async () => {
  const { data } = await db.from('posts').select('*').eq('slug', slug).maybeSingle()
  return data
})
if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Tulisan tidak ditemukan', fatal: true })
const html = computed(() => marked.parse(post.value.content || '') as string)
const pct = ref(0)
const onScroll = () => { const d = document.documentElement; pct.value = d.scrollTop / ((d.scrollHeight - d.clientHeight) || 1) }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
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
    <div class="prose-hiu mt-10" v-html="html" />
    <MessageForm :post-id="post.id" />
  </article>
</template>