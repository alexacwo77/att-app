<template>
  <div class="content">

    <div class="mb-4 text-lg font-semibold">
      Settings
    </div>

    <div class="bg-white rounded-xl shadow-sm p-4">

      <div class="flex justify-between items-center">

        <div>
          <div class="font-semibold">Admin Account</div>
          <div class="text-sm text-gray-500">
            Manage session
          </div>
        </div>

        <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
            @click="handleLogout"
        >
          Log Out
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    import { logout } from '../../services/api'

    const router = useRouter()
    const token = localStorage.getItem('token')

    const handleLogout = async () => {
        try {
            await logout(token)
        } catch (e) {
            console.warn('Logout failed:', e)
        }

        localStorage.removeItem('token')

        router.push('/login')
    }
</script>