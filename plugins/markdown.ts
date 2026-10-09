import { marked } from 'marked'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

let ready = false

export default defineNuxtPlugin(() => {
  if (ready) return
  ready = true
  marked.use({
    renderer: {
      image(this: any, token: any) {
        const alt = esc(token.text || '')
        const cap = token.text ? `<figcaption>${alt}</figcaption>` : ''
        return `<figure class="post-fig"><img src="${esc(token.href)}" alt="${alt}" loading="lazy" decoding="async">${cap}</figure>`
      },
      paragraph(this: any, token: any) {
        const imgs = token.tokens.filter((t: any) => t.type === 'image')
        const rest = token.tokens.filter((t: any) => t.type !== 'image' && t.type !== 'br' && (t.raw ?? '').trim() !== '')
        if (!imgs.length || rest.length) return false
        const html = imgs.map((t: any) => this.image(t)).join('')
        return imgs.length === 1 ? html : `<div class="photos photos-${Math.min(imgs.length, 3)}">${html}</div>`
      }
    }
  } as any)
})