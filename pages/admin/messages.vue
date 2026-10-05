<script setup lang="ts">
const db = useSupabaseClient<any>()
const filter = ref<'unread' | 'all'>('unread')
const { data: msgs, refresh } = await useAsyncData('admin-msgs', async () => {
  const { data } = await db.from('messages').select('id,body,is_read,created_at,posts(title,slug)')
    .order('created_at', { ascending: false }).limit(200)
  return (data ?? []) as any[]
})
const unread = computed(() => (msgs.value ?? []).filter((m: any) => !m.is_read).length)
const shown = computed(() => (msgs.value ?? []).filter((m: any) => filter.value === 'all' || !m.is_read))
async function toggle(m: any) { await db.from('messages').update({ is_read: !m.is_read }).eq('id', m.id); refresh() }
async function remove(id: string) {
  if (!confirm('Hapus pesan ini? Tidak bisa dibatalkan.')) return
  await db.from('messages').delete().eq('id', id); refresh()
}
useHead({ title: 'Pesan · HiuBlog' })
</script>
<template>
  <div class="mx-auto max-w-6xl px-5 py-12">
    <NuxtLink to="/admin" class="text-sm text-muted hover:text-primary">← Kembali</NuxtLink>
    <h1 class="mt-4 font-serif text-4xl font-semibold">Pesan masuk</h1>
    <div class="mt-6 flex gap-2">
      <button class="rounded-full px-4 py-1.5 text-sm font-bold" :class="filter === 'unread' ? 'bg-primary text-on-primary' : 'bg-surface2 text-muted'" @click="filter = 'unread'">Belum dibaca ({{ unread }})</button>
      <button class="rounded-full px-4 py-1.5 text-sm font-bold" :class="filter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface2 text-muted'" @click="filter = 'all'">Semua ({{ msgs?.length || 0 }})</button>
    </div>
    <ul class="mt-5 space-y-3">
      <li v-for="m in shown" :key="m.id" class="rounded-2xl border border-line bg-surface p-5" :class="!m.is_read && 'border-primary'">
        <p class="whitespace-pre-wrap leading-relaxed">{{ m.body }}</p>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <p>
            Untuk <NuxtLink v-if="m.posts" :to="`/posts/${m.posts.slug}`" class="font-bold text-primary hover:underline">{{ m.posts.title }}</NuxtLink><span v-else>(tulisan sudah dihapus)</span>
            · {{ new Date(m.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) }}
          </p>
          <div class="flex gap-2">
            <button class="btn btn-ghost !py-1.5" @click="toggle(m)">{{ m.is_read ? 'Tandai belum dibaca' : 'Tandai dibaca' }}</button>
            <button class="btn btn-ghost !py-1.5 text-red-600" @click="remove(m.id)">Hapus</button>
          </div>
        </div>
      </li>
    </ul>
    <p v-if="!shown.length" class="mt-10 text-center text-sm text-muted">{{ filter === 'unread' ? 'Nggak ada pesan baru.' : 'Belum ada pesan masuk.' }}</p>
  </div>
</template>