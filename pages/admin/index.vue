<script setup lang="ts">
const db = useSupabaseClient<any>()
const tab = ref<'draft' | 'scheduled' | 'published'>('scheduled')
const { data: posts, refresh } = await useAsyncData('admin-posts', async () => {
  const { data } = await db.from('posts').select('id,title,slug,status,published_at,updated_at').order('updated_at', { ascending: false })
  return data ?? []
})
const { data: unread } = await useAsyncData('admin-unread', async () => {
  const { count } = await db.from('messages').select('id', { count: 'exact', head: true }).eq('is_read', false)
  return count ?? 0
})
const kind = (p: any) => p.status === 'draft' ? 'draft' : new Date(p.published_at) > new Date() ? 'scheduled' : 'published'
const tabs = [['scheduled', 'Terjadwal'], ['draft', 'Draft'], ['published', 'Terbit']] as const
const shown = computed(() => (posts.value ?? []).filter((p: any) => kind(p) === tab.value))
const count = (k: string) => (posts.value ?? []).filter((p: any) => kind(p) === k).length
async function remove(id: string) {
  if (!confirm('Hapus tulisan ini? Tidak bisa dibatalkan.')) return
  await db.from('posts').delete().eq('id', id); refresh()
}
async function logout() { await db.auth.signOut(); navigateTo('/') }
useHead({ title: 'Admin · HiuBlog' })
</script>
<template>
  <div class="mx-auto max-w-6xl px-5 py-12">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="font-serif text-4xl font-semibold">Tulisan</h1>
      <div class="flex gap-2">
        <NuxtLink to="/admin/messages" class="btn btn-ghost">Pesan<span v-if="unread" class="rounded-full bg-primary px-2 text-xs text-on-primary">{{ unread }}</span></NuxtLink>
        <button class="btn btn-ghost" @click="logout">Keluar</button>
        <NuxtLink to="/admin/editor" class="btn btn-primary">Tulisan baru</NuxtLink>
      </div>
    </div>
    <div class="mt-8 flex gap-2">
      <button v-for="[k, l] in tabs" :key="k" class="rounded-full px-4 py-1.5 text-sm font-bold" :class="tab === k ? 'bg-primary text-on-primary' : 'bg-surface2 text-muted'" @click="tab = k">{{ l }} ({{ count(k) }})</button>
    </div>
    <ul class="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
      <li v-for="p in shown" :key="p.id" class="flex items-center justify-between gap-4 p-4">
        <div class="min-w-0">
          <p class="truncate font-semibold">{{ p.title }}</p>
          <p class="text-xs text-muted">{{ p.status === 'draft' ? 'Belum tayang' : (tab === 'scheduled' ? 'Tayang ' : 'Tayang sejak ') + new Date(p.published_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) }}</p>
        </div>
        <div class="flex shrink-0 gap-2 text-sm">
          <NuxtLink :to="{ path: '/admin/editor', query: { id: p.id } }" class="btn btn-ghost !py-1.5">Edit</NuxtLink>
          <button class="btn btn-ghost !py-1.5 text-red-600" @click="remove(p.id)">Hapus</button>
        </div>
      </li>
      <li v-if="!shown.length" class="p-8 text-center text-sm text-muted">Belum ada tulisan di sini. Klik "Tulisan baru" buat mulai.</li>
    </ul>
  </div>
</template>