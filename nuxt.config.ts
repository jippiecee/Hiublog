export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  // Hanya /admin yang diproteksi. Halaman publik (blog) tetap terbuka.
  supabase: {
    redirectOptions: { login: '/login', callback: '/login', include: ['/admin(/*)?'], exclude: [], cookieRedirect: false }
  },
  app: {
    head: {
      title: 'HiuBlog',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap' }
      ]
    }
  }
})