<script setup lang="ts">
const user = useSupabaseUser()
const route = useRoute()
const on = 'bg-primary text-on-primary'
const off = 'text-muted hover:bg-surface2 hover:text-ink'
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <header class="pointer-events-none sticky top-0 z-40 px-4 pt-4">
      <nav class="pointer-events-auto mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full border border-line bg-bg/80 p-2 shadow-[0_10px_30px_rgba(63,91,46,0.10)] backdrop-blur-xl" aria-label="Navigasi utama">
        <NuxtLink to="/" class="flex items-center gap-2.5 rounded-full pr-3" aria-label="HiuBlog, ke beranda">
          <span class="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-soft">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 3C9 3 4 9 4 15c0 1.5.4 2.8 1 3.9C7 14 11 11 16 9c-4 3-6.5 6.5-7.5 10.5 1 .3 2 .5 3 .5 6 0 8.5-6 8.5-10 0-2.5-.2-4.5 0-6Z"/></svg>
          </span>
          <span class="hidden font-display text-xl font-extrabold tracking-[-0.04em] text-ink sm:inline">HiuBlog</span>
        </NuxtLink>

        <div class="flex items-center gap-1">
          <NuxtLink to="/" class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold transition" :class="route.path === '/' ? on : off">Beranda</NuxtLink>
          <NuxtLink v-if="user" to="/admin" class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold transition" :class="route.path.startsWith('/admin') ? on : off">Admin</NuxtLink>
          <span class="mx-1 hidden h-5 w-px bg-line sm:block" aria-hidden="true"></span>
          <SearchPalette />
        </div>
      </nav>
    </header>
    <main class="flex-1"><slot /></main>
    <footer class="border-t border-line">
      <div class="mx-auto max-w-5xl px-5 py-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm text-muted">
        <p>© {{ new Date().getFullYear() }} HiuBlog. Ditulis Hiu, ditemani matcha.</p>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href="https://GANTI-URL-PORTFOLIO" target="_blank" rel="noopener" class="hover:text-primary">Portfolio</a>
          <a href="https://github.com/jippiecee" target="_blank" rel="noopener" class="hover:text-primary">GitHub</a>
          <a href="https://www.youtube.com/@hanif_Ibrahim" target="_blank" rel="noopener" class="hover:text-primary">YouTube</a>
          <NuxtLink v-if="!user" to="/login" class="hover:text-primary">Masuk</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>