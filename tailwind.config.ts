import type { Config } from 'tailwindcss'
const c = (n: string) => `rgb(var(--${n}) / <alpha-value>)`
export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      colors: { bg: c('bg'), surface: c('surface'), surface2: c('surface2'), primary: c('primary'), 'on-primary': c('on-primary'), soft: c('soft'), ink: c('ink'), muted: c('muted'), line: c('line') },
      // serif = judul tulisan & isi artikel. display = hero & logo (Switzer).
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        display: ['Switzer', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif']
      }
    }
  }
}