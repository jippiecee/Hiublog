<script setup lang="ts">
const db = useSupabaseClient<any>()
const route = useRoute()
const open = ref(false)
const q = ref('')
const sel = ref(0)
const input = ref<HTMLInputElement | null>(null)
const posts = ref<any[]>([])
const loaded = ref(false)
const loading = ref(false)

const load = async () => {
  if (loaded.value || loading.value) return
  loading.value = true
  const { data } = await db.from('posts').select('id,title,slug,excerpt,content,tags,published_at')
    .eq('status', 'published').lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
  posts.value = data ?? []
  loaded.value = true
  loading.value = false
}
const show = () => { open.value = true; load(); nextTick(() => input.value?.focus()) }
const hide = () => { open.value = false; q.value = '' }

const words = computed(() => q.value.trim().toLowerCase().split(/\s+/).filter(Boolean))
const results = computed<any[]>(() => {
  const w = words.value
  if (!w.length) return []
  const scored: { p: any; score: number }[] = []
  for (const p of posts.value) {
    const title = (p.title || '').toLowerCase()
    const tags = (p.tags || []).join(' ').toLowerCase()
    const ex = (p.excerpt || '').toLowerCase()
    const body = (p.content || '').toLowerCase()
    let score = 0, ok = true
    for (const x of w) {
      const s = (title.includes(x) ? 3 : 0) + (tags.includes(x) ? 2 : 0) + (ex.includes(x) ? 2 : 0) + (body.includes(x) ? 1 : 0)
      if (!s) { ok = false; break }
      score += s
    }
    if (ok) scored.push({ p, score })
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 8).map((x) => x.p)
})

// Kalau kata cuma ada di isi tulisan, tampilkan potongan kalimat di sekitarnya
const snippet = (p: any) => {
  const ex: string = p.excerpt || ''
  const w = words.value
  if (!w.length || w.some((x) => ex.toLowerCase().includes(x))) return ex
  const text = (p.content || '').replace(/[#*_`>\[\]]/g, '').replace(/\s+/g, ' ')
  const i = text.toLowerCase().indexOf(w[0])
  if (i < 0) return ex
  const start = Math.max(0, i - 50)
  return (start > 0 ? '…' : '') + text.slice(start, start + 140) + '…'
}

watch(q, () => { sel.value = 0 })
watch(sel, () => nextTick(() => document.getElementById(`sr-${sel.value}`)?.scrollIntoView({ block: 'nearest' })))
watch(open, (v) => { document.body.style.overflow = v ? 'hidden' : '' })
watch(() => route.fullPath, () => { if (open.value) hide() })

const move = (d: number) => { if (results.value.length) sel.value = (sel.value + d + results.value.length) % results.value.length }
const enter = () => { const p = results.value[sel.value]; if (p) { hide(); navigateTo(`/posts/${p.slug}`) } }

const onKey = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null
  const typing = !!t && (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) || t.isContentEditable)
  if ((e.key === '/' && !typing && !open.value) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); show() }
  else if (e.key === 'Escape' && open.value) hide()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' })
</script>
<template>
  <button type="button" class="flex min-h-11 items-center gap-2 rounded-full border border-line bg-bg px-3.5 text-sm font-bold text-ink transition hover:bg-surface2 sm:px-4" aria-label="Cari tulisan" @click="show">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    <span class="hidden sm:inline">Cari</span>
  </button>
  
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[60] bg-ink/30 p-3 backdrop-blur-sm sm:p-6 sm:pt-[12vh]" @click.self="hide">
      <div class="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-bg shadow-2xl" role="dialog" aria-modal="true" aria-label="Cari tulisan">
        <div class="flex items-center gap-3 px-4">
          <svg class="shrink-0 text-muted" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            ref="input" v-model="q" type="text" placeholder="Cari tulisan..." autocomplete="off" spellcheck="false" aria-label="Cari tulisan"
            class="h-14 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-muted focus:outline-none focus-visible:outline-none"
            @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)" @keydown.enter.prevent="enter"
          >
          <button type="button" class="shrink-0 rounded-md border border-line px-2 py-0.5 text-[11px] font-semibold text-muted hover:text-ink" aria-label="Tutup pencarian" @click="hide">Esc</button>
        </div>

        <div v-if="words.length" class="max-h-[60vh] overflow-y-auto border-t border-line p-2">
          <p v-if="loading" class="px-3 py-6 text-center text-sm text-muted">Memuat...</p>
          <template v-else-if="results.length">
            <NuxtLink
              v-for="(p, i) in results" :id="`sr-${i}`" :key="p.id" :to="`/posts/${p.slug}`"
              class="block rounded-xl px-3 py-3" :class="i === sel ? 'bg-surface2' : 'hover:bg-surface'"
              @mouseenter="sel = i" @click="hide"
            >
              <p class="font-serif text-lg leading-snug" v-html="highlightText(p.title, q)" />
              <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-muted" v-html="highlightText(snippet(p), q)" />
            </NuxtLink>
          </template>
          <p v-else class="px-3 py-6 text-center text-sm text-muted">Nggak ada tulisan yang cocok.</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>