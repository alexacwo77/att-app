<template>
  <div class="content">

    <div class="mb-4 text-lg font-semibold">
      Profile
    </div>

    <div class="bg-white rounded-xl shadow-sm p-4">

      <div class="flex justify-between items-center">

        <div>
          <div class="font-semibold">Superadmin Account</div>
          <div class="text-sm text-gray-500">
            Manage session
          </div>
        </div>

        <button
            class="pushable delete"
            @click="handleLogout"
        >
          <span class="shadow"></span>
          <span class="edge"></span>

          <span class="front">
            <i class="fa-solid fa-right-from-bracket"></i>
            Log Out
          </span>
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