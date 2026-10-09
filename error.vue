<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage?: string; message?: string } }>()

const is404 = computed(() => props.error.statusCode === 404)
const title = computed(() => {
  if (is404.value) {
    const m = props.error.statusMessage || ''
    return m && !m.startsWith('Page not found') ? m : 'Halaman ini nggak ketemu'
  }
  return 'Lagi ada masalah'
})
const desc = computed(() =>
  is404.value
    ? 'Mungkin linknya salah ketik, atau tulisannya sudah dipindah atau dihapus.'
    : 'Ada yang nggak beres di sisi blog. Coba muat ulang sebentar lagi.'
)

const home = () => clearError({ redirect: '/' })
const reload = () => reloadNuxtApp()

useHead({ title: `${props.error.statusCode} · HiuBlog` })
useSeoMeta({ robots: 'noindex' })
</script>
<template>
  <NuxtLayout>
    <section class="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-5 py-20 text-center">
      <p class="font-serif text-8xl font-semibold text-primary/20" aria-hidden="true">{{ error.statusCode }}</p>
      <h1 class="mt-2 font-serif text-3xl font-semibold md:text-4xl">{{ title }}</h1>
      <p class="mt-4 text-muted">{{ desc }}</p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <button class="btn btn-primary" @click="home">Ke beranda</button>
        <button v-if="!is404" class="btn btn-ghost" @click="reload">Muat ulang</button>
      </div>
    </section>
  </NuxtLayout>
</template>