export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
export const readTime = (text = '') => Math.max(1, Math.round(text.split(/\s+/).length / 200))
export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
// "2026-10-05T08:00" (jam lokal browser) -> ISO UTC; aman dari geser zona waktu
export const toISO = (local: string) => new Date(local).toISOString()
export const toLocalInput = (iso: string) => {
  const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
// Teks aman (di-escape) dengan kata pencarian dibungkus <mark>. Dipakai bareng v-html.
export const highlightText = (text = '', q = '') => {
  const words = q.trim().split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!words.length) return esc(text)
  return text
    .split(new RegExp(`(${words.join('|')})`, 'gi'))
    .map((p, i) => (i % 2 ? `<mark class="rounded bg-soft px-0.5 text-ink">${esc(p)}</mark>` : esc(p)))
    .join('')
}