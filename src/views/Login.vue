<template>
  <div class="flex items-center justify-center h-screen">
    <div class="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">
      <h2 class="mb-4 text-xl">Login</h2>
      <input v-model="email" placeholder="Email" class="w-full mb-2 p-2 border rounded" />
      <input v-model="password" type="password" placeholder="Password" class="w-full mb-4 p-2 border rounded" />
      <button @click="handleLogin" class="w-full bg-blue-500 text-white p-2 rounded">Login</button>
    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { login } from '../services/api'

    const email = ref('')
    const password = ref('')
    const router = useRouter()

    const handleLogin = async () => {
        const res = await login({ email: email.value, password: password.value })
        const token = res.data.token

        localStorage.setItem('token', token)
        router.push('/dashboard')
    }
</script>