<script setup lang="ts">
const props = defineProps<{ postId: string }>()
const db = useSupabaseClient<any>()
const body = ref(''), trap = ref(''), err = ref('')
const state = ref<'idle' | 'sending' | 'sent'>('idle')
async function send() {
  err.value = ''
  if (trap.value) { state.value = 'sent'; return } // jebakan bot
  if (!body.value.trim()) { err.value = 'Tulis pesannya dulu ya.'; return }
  try {
    if (Date.now() - Number(localStorage.getItem('hiu-last-msg') || 0) < 30000) { err.value = 'Tunggu 30 detik sebelum kirim pesan lagi.'; return }
  } catch {}
  state.value = 'sending'
  const { error } = await db.from('messages').insert({ post_id: props.postId, body: body.value.trim() })
  if (error) { state.value = 'idle'; err.value = 'Pesan gagal terkirim. Coba lagi sebentar.'; return }
  try { localStorage.setItem('hiu-last-msg', String(Date.now())) } catch {}
  body.value = ''; state.value = 'sent'
}
</script>
<template>
  <section class="mt-16 rounded-2xl border border-line bg-surface p-6 md:p-8">
    <div v-if="state === 'sent'">
      <h2 class="font-serif text-2xl font-semibold">Pesan terkirim, makasih!</h2>
      <p class="mt-2 text-sm text-muted">Pesan lu sudah masuk dan cuma gue yang bisa baca.</p>
      <button class="btn btn-ghost mt-4" @click="state = 'idle'">Kirim pesan lain</button>
    </div>
    <form v-else @submit.prevent="send">
      <h2 class="font-serif text-2xl font-semibold">Ada kritik atau saran?</h2>
      <p class="mt-2 text-sm text-muted">Kirim aja, anonim dan tanpa akun. Pesannya nggak ditampilin di halaman, cuma gue yang baca.</p>
      <input v-model="trap" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0" />
      <textarea v-model="body" rows="4" maxlength="1000" class="field mt-4 resize-y" placeholder="Tulis pesan lu di sini..." />
      <div class="mt-3 flex items-center justify-between gap-3">
        <p class="text-xs" :class="err ? 'text-red-600' : 'text-muted'">{{ err || body.length + ' / 1000' }}</p>
        <button class="btn btn-primary" :disabled="state === 'sending'">{{ state === 'sending' ? 'Mengirim...' : 'Kirim pesan' }}</button>
      </div>
    </form>
  </section>
</template>