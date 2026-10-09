<script setup lang="ts">
import { marked } from 'marked'
const db = useSupabaseClient<any>()
const id = useRoute().query.id as string | undefined
const f = reactive({ title: '', slug: '', excerpt: '', content: '', tags: '', mode: 'draft' as 'draft' | 'schedule' | 'now', when: '' })
const msg = ref(''), busy = ref(false), uploading = ref(false)
const area = ref<HTMLTextAreaElement>()
const fileEl = ref<HTMLInputElement>()
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

function insertAtCursor(text: string, caretOffset?: number) {
  const el = area.value
  const start = el?.selectionStart ?? f.content.length
  const end = el?.selectionEnd ?? f.content.length
  const before = f.content.slice(0, start), after = f.content.slice(end)
  const pre = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : ''
  const post = after && !after.startsWith('\n\n') ? (after.startsWith('\n') ? '\n' : '\n\n') : ''
  f.content = before + pre + text + post + after
  const pos = before.length + pre.length + (caretOffset ?? text.length)
  nextTick(() => { el?.focus(); el?.setSelectionRange(pos, pos) })
}
async function uploadFiles(files: File[]) {
  msg.value = ''
  uploading.value = true
  const urls: string[] = []
  for (const file of files) {
    if (!file.type.startsWith('image/')) { msg.value = 'Hanya file gambar yang bisa diunggah.'; continue }
    if (file.size > 5 * 1024 * 1024) { msg.value = `${file.name} lebih dari 5 MB.`; continue }
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`
    const { error } = await db.storage.from('post-images').upload(path, file, { contentType: file.type, cacheControl: '31536000' })
    if (error) { msg.value = 'Gagal unggah: ' + error.message; continue }
    urls.push(db.storage.from('post-images').getPublicUrl(path).data.publicUrl)
  }
  uploading.value = false
  if (urls.length === 1) insertAtCursor(`![](${urls[0]})`, 2)
  else if (urls.length > 1) insertAtCursor(urls.map(u => `![](${u})`).join('\n'))
}
function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  if (files.length) uploadFiles(files)
}
function onPaste(e: ClipboardEvent) {
  const files = Array.from(e.clipboardData?.files ?? []).filter(x => x.type.startsWith('image/'))
  if (files.length) { e.preventDefault(); uploadFiles(files) }
}
function onDrop(e: DragEvent) {
  const files = Array.from(e.dataTransfer?.files ?? []).filter(x => x.type.startsWith('image/'))
  if (files.length) { e.preventDefault(); uploadFiles(files) }
}

async function save() {
  msg.value = ''
  if (!f.title.trim()) return (msg.value = 'Judul wajib diisi.')
  if (f.mode === 'schedule' && !f.when) return (msg.value = 'Pilih tanggal dan jam tayang dulu.')
  busy.value = true
  const row: any = {
    title: f.title.trim(), slug: f.slug.trim() || slugify(f.title), excerpt: f.excerpt, content: f.content,
    tags: f.tags.split(',').map(t => t.trim()).filter(Boolean),
    status: f.mode === 'draft' ? 'draft' : 'published',
    published_at: f.mode === 'draft' ? null : f.when ? toISO(f.when) : new Date().toISOString()
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
        <button class="btn btn-primary" :disabled="busy" @click="save">{{ f.mode === 'draft' ? 'Simpan draft' : f.mode === 'schedule' ? 'Jadwalkan' : id ? 'Simpan' : 'Terbitkan' }}</button>
      </div>
    </div>
    <p v-if="msg" class="mt-3 text-sm text-red-600">{{ msg }}</p>
    <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
      <div class="space-y-3 min-w-0">
        <input v-model="f.title" class="field !text-2xl font-serif" placeholder="Judul" />
        <input v-model="f.excerpt" class="field" placeholder="Ringkasan singkat (tampil di kartu)" />
        <div>
          <button type="button" class="btn btn-ghost !py-1.5" :disabled="uploading" @click="fileEl?.click()">{{ uploading ? 'Mengunggah…' : 'Sisipkan foto' }}</button>
          <input ref="fileEl" type="file" accept="image/*" multiple class="hidden" @change="onPick" />
        </div>
        <div class="grid gap-3 md:grid-cols-2">
          <textarea ref="area" v-model="f.content" rows="22" class="field font-mono text-[13.5px] leading-7 resize-y" placeholder="Tulis dalam Markdown..."
            @paste="onPaste" @drop="onDrop" @dragover="e => e.dataTransfer?.types.includes('Files') && e.preventDefault()" />
          <div class="prose-hiu !text-base rounded-xl border border-line bg-surface p-5 overflow-auto max-h-[34rem]" v-html="preview" />
        </div>
      </div>
      <aside class="space-y-4 text-sm">
        <div>
          <label class="font-semibold">Status</label>
          <select v-model="f.mode" class="field mt-1">
            <option value="draft">Draft</option>
            <option value="schedule">Jadwalkan</option>
            <option value="now">{{ id ? 'Terbit' : 'Terbitkan sekarang' }}</option>
          </select>
        </div>
        <div v-if="f.mode !== 'draft'">
          <label class="font-semibold">{{ f.mode === 'schedule' ? 'Tayang pada' : 'Tanggal posting' }}</label>
          <input v-model="f.when" type="datetime-local" class="field mt-1" />
        </div>
        <div><label class="font-semibold">Tag</label><input v-model="f.tags" class="field mt-1" placeholder="CSS, Vue, Refleksi" /></div>
        <div><label class="font-semibold">Slug</label><input v-model="f.slug" class="field mt-1" placeholder="otomatis dari judul" /></div>
      </aside>
    </div>
  </div>
</template>