<script setup lang="ts">
defineProps<{ post: any; q?: string }>()
</script>
<template>
  <NuxtLink :to="`/posts/${post.slug}`" class="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition hover:border-primary">
    <div>
      <p class="text-xs text-muted">{{ fmtDate(post.published_at) }} · {{ readTime(post.content) }} menit baca</p>
      <h3 class="mt-2 font-serif text-2xl leading-snug group-hover:text-primary" v-html="highlightText(post.title, q)" />
      <p class="mt-2 text-sm text-muted leading-relaxed line-clamp-3" v-html="highlightText(post.excerpt, q)" />
    </div>
    <div class="mt-5 flex flex-wrap gap-1.5">
      <span v-for="t in post.tags" :key="t" class="rounded-full bg-surface2 px-2.5 py-0.5 text-xs text-muted">{{ t }}</span>
    </div>
  </NuxtLink>
</template>