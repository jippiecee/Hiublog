<script setup lang="ts">
import { marked } from 'marked'
const db = useSupabaseClient<any>()
const id = useRoute().query.id as string | undefined
const f = reactive({ title: '', slug: '', excerpt: '', content: '', tags: '', mode: 'draft' as 'draft' | 'schedule' | 'now', when: '' })
const msg = ref(''), busy = ref(false)
const words = computed(() => (f.content.trim() ? f.content.trim().split(/\s+/).length : 0))
const onKey = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save() } }
onMounted(() => {
  window.addEventListener('keydown', onKey)
  if (!id) {
    try { const d = localStorage.getItem('hiu-draft'); if (d && !f.title && !f.content) Object.assign(f, JSON.parse(d)) } catch {}
    watch(f, v => { try { localStorage.setItem('hiu-draft', JSON.stringify(v)) } catch {} }, { deep: true })
  }
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
if (id) {
  const { data } = await db.from('posts').select('*').eq('id', id).single()
  if (data) Object.assign(f, { title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content, tags: (data.tags ?? []).join(', '),
    mode: data.status === 'draft' ? 'draft' : new Date(data.published_at) > new Date() ? 'schedule' : 'now', when: data.published_at ? toLocalInput(data.published_at) : '' })
}
const preview = computed(() => marked.parse(f.content || '') as string)
async function save() {
  msg.value = ''
  if (!f.title.trim()) return (msg.value = 'Judul wajib diisi.')
  if (f.mode === 'schedule' && !f.when) return (msg.value = 'Pilih tanggal dan jam tayang dulu.')
  busy.value = true
  const row: any = {
    title: f.title.trim(), slug: f.slug.trim() || slugify(f.title), excerpt: f.excerpt, content: f.content,
    tags: f.tags.split(',').map(t => t.trim()).filter(Boolean),
    status: f.mode === 'draft' ? 'draft' : 'published',
    published_at: f.mode === 'draft' ? null : f.mode === 'now' ? new Date().toISOString() : toISO(f.when)
  }
  const { error } = id ? await db.from('posts').update(row).eq('id', id) : await db.from('posts').insert(row)
  busy.value = false
  if (error) msg.value = error.message.includes('duplicate') ? 'Slug sudah dipakai, ganti slug-nya.' : error.message
  else { try { localStorage.removeItem('hiu-draft') } catch {} navigateTo('/admin') }
}
useHead({ title: 'Editor · HiuBlog' })
</script>
<template>
  <div class="mx-auto max-w-6xl px-5 py-10">
    <div class="sticky top-16 z-30 -mx-5 flex items-center justify-between border-b border-line bg-bg/90 px-5 py-3 backdrop-blur">
      <NuxtLink to="/admin" class="text-sm text-muted hover:text-primary">← Kembali</NuxtLink>
      <div class="flex items-center gap-4">
        <span class="hidden text-xs text-muted sm:inline">{{ words }} kata · Ctrl+S simpan</span>
        <button class="btn btn-primary" :disabled="busy" @click="save">{{ f.mode === 'draft' ? 'Simpan draft' : f.mode === 'schedule' ? 'Jadwalkan' : 'Terbitkan' }}</button>
      </div>
    </div>
    <p v-if="msg" class="mt-3 text-sm text-red-600">{{ msg }}</p>
    <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
      <div class="space-y-3 min-w-0">
        <input v-model="f.title" class="field !text-2xl font-serif" placeholder="Judul" />
        <input v-model="f.excerpt" class="field" placeholder="Ringkasan singkat (tampil di kartu)" />
        <div class="grid gap-3 md:grid-cols-2">
          <textarea v-model="f.content" rows="22" class="field font-mono text-[13.5px] leading-7 resize-y" placeholder="Tulis dalam Markdown..." />
          <div class="prose-hiu !text-base rounded-xl border border-line bg-surface p-5 overflow-auto max-h-[34rem]" v-html="preview" />
        </div>
      </div>
      <aside class="space-y-4 text-sm">
        <div>
          <label class="font-semibold">Status</label>
          <select v-model="f.mode" class="field mt-1">
            <option value="draft">Draft</option><option value="schedule">Jadwalkan</option><option value="now">Terbitkan sekarang</option>
          </select>
        </div>
        <div v-if="f.mode === 'schedule'">
          <label class="font-semibold">Tayang pada</label>
          <input v-model="f.when" type="datetime-local" class="field mt-1" />
          <p class="mt-1 text-xs text-muted">Pakai jam di perangkat lu.</p>
        </div>
        <div><label class="font-semibold">Tag</label><input v-model="f.tags" class="field mt-1" placeholder="CSS, Vue, Refleksi" /></div>
        <div><label class="font-semibold">Slug</label><input v-model="f.slug" class="field mt-1" placeholder="otomatis dari judul" /></div>
      </aside>
    </div>
  </div>
</template>