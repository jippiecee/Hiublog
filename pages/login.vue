<script setup lang="ts">
const db = useSupabaseClient()
const user = useSupabaseUser()
const email = ref(''), password = ref(''), err = ref(''), busy = ref(false)
watchEffect(() => { if (user.value) navigateTo('/admin') })
async function login() {
  busy.value = true; err.value = ''
  const { error } = await db.auth.signInWithPassword({ email: email.value, password: password.value })
  if (error) err.value = 'Email atau password salah. Coba cek lagi.'
  busy.value = false
}
useHead({ title: 'Masuk · HiuBlog' })
</script>
<template>
  <div class="mx-auto max-w-sm px-5 py-24">
    <h1 class="font-serif text-4xl">Masuk</h1>
    <p class="mt-2 text-sm text-muted">Khusus pemilik blog.</p>
    <form class="mt-8 space-y-3" @submit.prevent="login">
      <input v-model="email" type="email" required class="field" placeholder="Email" autocomplete="email" />
      <input v-model="password" type="password" required class="field" placeholder="Password" autocomplete="current-password" />
      <p v-if="err" class="text-sm text-red-600">{{ err }}</p>
      <button class="btn btn-primary w-full" :disabled="busy">{{ busy ? 'Masuk...' : 'Masuk' }}</button>
    </form>
  </div>
</template>
