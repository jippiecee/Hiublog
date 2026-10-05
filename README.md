# HiuBlog
Blog pribadi: Nuxt 3 + Supabase + Tailwind. Tulisan bisa dijadwalkan; hanya pemilik yang bisa login dan menulis.

## Jalankan
1. `cp .env.example .env` lalu isi URL dan key Supabase
2. Jalankan `supabase/schema.sql` di SQL Editor Supabase (ganti UUID)
3. Matikan signup publik: Authentication > Sign In / Providers > Email
4. `npm install && npm run dev`

## Deploy ke Vercel
Push ke GitHub, import di Vercel, tambah env `SUPABASE_URL` dan `SUPABASE_KEY`, Deploy.
