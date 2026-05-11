<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 relative p-6">

    <Transition name="toast">
      <div
          v-if="toast"
          class="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg text-base scale-110"
      >
        {{ toast }}
      </div>
    </Transition>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">

      <h2 class="text-xl font-bold mb-4">Login</h2>

      <input
          v-model="email"
          placeholder="Email"
          class="w-full border p-2 mb-3 rounded"
      />

      <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border p-2 mb-3 rounded"
      />

      <label class="flex items-center gap-2 mb-3 text-sm">
        <input type="checkbox" v-model="remember" />
        Remember me
      </label>

      <button
          @click="handleLogin"
          class="w-full bg-blue-600 text-white p-2 rounded"
      >
        Login
      </button>

      <div class="mt-3 text-sm text-center">
        <router-link to="/forgot-password" class="text-blue-500">
          Forgot password?
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { login as loginRequest } from '../../services/api'
    import { useToast } from '../../composables/useToast'

    const { showToast } = useToast()

    const router = useRouter()

    const email = ref('')
    const password = ref('')
    const remember = ref(false)

    let toastTimer = null

    const handleLogin = async () => {
        try {
            const res = await loginRequest({
                email: email.value,
                password: password.value
            })

            const token = res.token

            localStorage.setItem('token', token)

            /* TODO:
            if (remember.value) {
                localStorage.setItem('token', token)
            } else {
                sessionStorage.setItem('token', token)
            }
             */

            router.push('/')

        } catch (e) {
            showToast('Authentication error: ' + e.message, 'error')
        }
    }
</script>