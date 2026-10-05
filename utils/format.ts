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
