<script setup lang="ts">
const user = useSupabaseUser()
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-40 border-b border-line bg-bg">
      <div class="mx-auto max-w-6xl h-16 px-5 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 font-serif text-2xl font-semibold text-primary">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 3C9 3 4 9 4 15c0 1.5.4 2.8 1 3.9C7 14 11 11 16 9c-4 3-6.500 6.500-7.500 10.500 1 .3 2 .5 3 .5 6 0 8.500-6 8.500-10 0-2.500-.2-4.500 0-6Z"/></svg>
          HiuBlog
        </NuxtLink>
        <nav class="flex items-center gap-1 text-sm font-bold">
          <SearchPalette />
          <NuxtLink to="/" class="px-3 py-1.5 rounded-lg hover:bg-surface2" active-class="bg-surface2">Beranda</NuxtLink>
          <NuxtLink v-if="user" to="/admin" class="px-3 py-1.5 rounded-lg hover:bg-surface2" active-class="bg-surface2">Admin</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="flex-1"><slot /></main>
    <footer class="border-t border-line">
      <div class="mx-auto max-w-6xl px-5 py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <p>© {{ new Date().getFullYear() }} HiuBlog. Ditulis Hiu, ditemani matcha.</p>
        <NuxtLink v-if="!user" to="/login" class="hover:text-primary">Masuk</NuxtLink>
      </div>
    </footer>
  </div>
</template>