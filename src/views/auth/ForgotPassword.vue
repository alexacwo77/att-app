<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">

      <h2 class="text-xl font-bold mb-4">Forgot Password</h2>

      <input
          v-model="email"
          placeholder="Email"
          class="w-full border p-2 mb-3 rounded"
      />

      <button
          @click="submit"
          class="w-full bg-blue-600 text-white p-2 rounded"
      >
        Send reset link
      </button>

      <p v-if="message" class="text-green-600 text-sm mt-2">
        {{ message }}
      </p>

      <p v-if="error" class="text-red-500 text-sm mt-2">
        {{ error }}
      </p>

      <router-link to="/login" class="text-sm text-blue-500 block mt-3">
        Back to login
      </router-link>

    </div>

  </div>
</template>

<script setup>
    import { ref } from 'vue'
    // TODO: fix later
    //import { request } from '../../services/api'

    const email = ref('')
    const message = ref('')
    const error = ref('')

    const submit = async () => {
        // TODO: fix later
        /*
        message.value = ''
        error.value = ''

        try {
            const res = await request('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email: email.value })
            })

            message.value = res.message
        } catch (e) {
            error.value = e.message || 'Email not found'
        }
        */
    }
</script>