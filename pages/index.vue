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
const PINNED = 'hiublog' // tulisan dengan slug atau judul ini selalu disematkan di atas
const lead = computed(() => {
  if (active.value) return null
  const pinned = list.value.find((p: any) => p.slug === PINNED || p.title?.toLowerCase() === PINNED)
  return pinned ?? list.value[0] ?? null
})
const items = computed(() => (lead.value ? list.value.filter((p: any) => p.id !== lead.value.id) : list.value))
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

const latest = computed(() => posts.value?.[0] ?? null)
const openSearch = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))

const listEl = ref<HTMLElement | null>(null)
watch(() => route.query.page, () => nextTick(() => listEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })))

useHead({ title: 'HiuBlog · Catatan' })
</script>
<template>
  <div>
    <section class="relative flex flex-col items-center px-5 pb-24 pt-20 text-center md:pt-28" style="background-image:radial-gradient(#C9D5B8 1.2px, transparent 1.2px);background-size:24px 24px">
      <div class="absolute hidden items-center justify-center bg-primary text-soft shadow-[0_14px_28px_rgba(63,91,46,0.28)] lg:flex left-[8%] top-16 h-[88px] w-[88px] -rotate-[8deg] rounded-[26px]" aria-hidden="true"><svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3C9 3 4 9 4 15c0 1.5.4 2.8 1 3.9C7 14 11 11 16 9c-4 3-6.5 6.5-7.5 10.5 1 .3 2 .5 3 .5 6 0 8.5-6 8.5-10 0-2.5-.2-4.5 0-6Z"/></svg></div>
      <div class="absolute hidden items-center justify-center bg-primary text-soft shadow-[0_14px_28px_rgba(63,91,46,0.28)] lg:flex right-[9%] top-14 h-[88px] w-[88px] rotate-[7deg] rounded-[26px]" aria-hidden="true"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/></svg></div>
      <div class="absolute hidden items-center justify-center bg-primary text-soft shadow-[0_14px_28px_rgba(63,91,46,0.28)] lg:flex bottom-14 left-[12%] h-20 w-20 rotate-[6deg] rounded-3xl" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M8 7h7"/></svg></div>
      <div class="absolute hidden items-center justify-center bg-primary text-soft shadow-[0_14px_28px_rgba(63,91,46,0.28)] lg:flex bottom-16 right-[11%] h-20 w-20 -rotate-[7deg] rounded-3xl" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h12v4a6 6 0 0 1-12 0V9z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/><path d="M8 3c0 1.5 1.5 1.5 1.5 3M12 3c0 1.5 1.5 1.5 1.5 3"/></svg></div>

      <span class="rounded-md bg-ink px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide text-soft">Catatan belajar harian</span>
      <h1 class="mt-6 max-w-5xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">Hal yang gua pelajari, temuin, dan akhirnya <span class="inline-block -rotate-1 rounded-[0.2em] bg-soft px-[0.14em] leading-[1.05]">ngerti</span> hari ini.</h1>
      <p class="mt-7 max-w-xl text-lg leading-relaxed text-muted">Apa yang gua alami, pelajari, tonton, baca, dan pikirin hari ini, dari mana pun gua lagi berada. Ditulis buat melatih menulis, dibaca siapa aja.</p>
      <div class="mt-9 flex flex-wrap justify-center gap-3">
        <NuxtLink v-if="latest" :to="`/posts/${latest.slug}`" class="btn btn-primary !min-h-12 !rounded-full !px-6 !text-[15px]">
          Baca tulisan terbaru
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </NuxtLink>
        <button type="button" class="btn btn-ghost !min-h-12 !rounded-full border border-line !px-6 !text-[15px]" @click="openSearch">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          Cari tulisan
        </button>
      </div>
    </section>

    <div class="mx-auto max-w-5xl px-5 pb-20">
      <NuxtLink v-if="showLead" :to="`/posts/${lead.slug}`" class="group relative flex flex-wrap items-end justify-between gap-8 overflow-hidden rounded-[2rem] bg-primary p-8 text-on-primary md:p-12">
        <svg class="pointer-events-none absolute -right-8 -top-8 text-soft opacity-10" width="320" height="320" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 3C9 3 4 9 4 15c0 1.5.4 2.8 1 3.9C7 14 11 11 16 9c-4 3-6.5 6.5-7.5 10.5 1 .3 2 .5 3 .5 6 0 8.5-6 8.5-10 0-2.5-.2-4.5 0-6Z"/></svg>
        <div class="relative max-w-xl">
          <span class="relative -top-2 inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-xs font-bold text-primary md:-top-3"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 3H8v2l1 1v5l-3 4v2h5v5l1 1 1-1v-5h5v-2l-3-4V6l1-1V3Z"/></svg>Disematkan</span>
          <h2 class="mt-4 font-serif text-4xl leading-tight md:text-5xl">{{ lead.title }}</h2>
          <p class="mt-3 text-[17px] leading-relaxed text-surface2">{{ lead.excerpt }}</p>
          <p class="mt-5 text-sm text-soft">{{ fmtDate(lead.published_at) }} · {{ readTime(lead.content) }} menit baca</p>
        </div>
        <span class="relative flex h-16 w-16 items-center justify-center rounded-full bg-soft text-primary transition group-hover:scale-105" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>
        </span>
      </NuxtLink>

      <section ref="listEl" class="mt-12 scroll-mt-24">
        <div v-if="tags.length" class="flex flex-wrap gap-2">
          <NuxtLink to="/" class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold" :class="!active ? 'bg-primary text-on-primary' : 'bg-surface text-muted hover:bg-surface2 hover:text-ink'">Semua</NuxtLink>
          <NuxtLink v-for="t in tags" :key="t" :to="{ path: '/', query: { tag: t } }" class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold" :class="active === t ? 'bg-primary text-on-primary' : 'bg-surface text-muted hover:bg-surface2 hover:text-ink'">{{ t }}</NuxtLink>
        </div>

        <div class="mt-6 grid gap-5 md:grid-cols-2">
          <PostCard v-for="p in paged" :key="p.id" :post="p" />
          <div v-if="!paged.length" class="col-span-full flex min-h-[200px] items-center justify-center rounded-3xl border-2 border-dashed border-[#C9D5B8] p-6 text-center leading-relaxed text-muted md:min-h-[260px]">
            <p>{{ list.length ? 'Belum ada tulisan lain.' : 'Belum ada tulisan yang tayang.' }}<br>Cek lagi nanti ya.</p>
          </div>
        </div>

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
  </div>
</template>