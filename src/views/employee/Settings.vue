<template>
  <div class="content">

    <!-- PROFILE -->
    <div class="profile-header">
      <div class="large-avatar">
        {{ selectedAvatar }}
      </div>

      <div class="mt-2 text-sm text-blue-600 cursor-pointer">
        Change Avatar
      </div>

      <!-- AVATAR SELECT -->
      <div class="flex gap-2 mt-3 justify-center">
        <button
            v-for="avatar in avatars"
            :key="avatar"
            @click="selectedAvatar = avatar"
            class="text-xl p-2 rounded-lg border"
            :class="selectedAvatar === avatar ? 'border-blue-500' : 'border-transparent'"
        >
          {{ avatar }}
        </button>
      </div>

      <input
          class="nickname-input"
          type="text"
          v-model="nickname"
          placeholder="Nickname"
      />

      <input
          class="nickname-input mt-2"
          type="email"
          v-model="email"
          placeholder="Email"
      />

      <div class="mt-3 text-sm text-gray-500">
        Points: <b>{{ points }}</b>
      </div>
    </div>

    <!-- SECURITY -->
    <div class="settings-section">
      <div class="section-title">Security</div>

      <div class="setting-item flex justify-between items-center">
        <span>Change Password</span>
        <button class="text-blue-600 text-sm">
          Update
        </button>
      </div>
    </div>

    <!-- APPEARANCE -->
    <div class="settings-section">
      <div class="section-title">Appearance</div>

      <div class="setting-item">
        <span>Dark Mode</span>

        <label class="relative inline-flex items-center cursor-pointer">
          <input
              type="checkbox"
              v-model="isDark"
              @change="toggleTheme"
              class="sr-only peer"
          />
          <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
          <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
        </label>
      </div>
    </div>

    <!-- ACCOUNT -->
    <div class="settings-section">
      <div class="section-title">Account</div>

      <div class="setting-item">
        <span>Email Verified</span>
        <span class="text-green-500 text-sm">Yes</span>
      </div>

      <div class="logout cursor-pointer" @click="handleLogout">
        Log Out
      </div>
    </div>

  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { getMe, logout as logoutRequest } from '../../services/api'

    const router = useRouter()

    const token =
        localStorage.getItem('token') || sessionStorage.getItem('token')

    const isDark = ref(false)

    const nickname = ref('')
    const email = ref('')
    const points = ref(0)

    const avatars = ['🦊', '🐱', '🐶', '🐼', '🐸']
    const selectedAvatar = ref('🦊')

    onMounted(async () => {
        const me = await getMe(token)

        nickname.value = me.nickname || me.name
        email.value = me.email
        points.value = me.points || 0

        selectedAvatar.value = me.avatar || '🦊'

        const saved = localStorage.getItem('theme')
        isDark.value = saved === 'dark'
        document.documentElement.classList.toggle('dark', isDark.value)
    })

    const toggleTheme = () => {
        const theme = isDark.value ? 'dark' : 'light'

        document.documentElement.classList.toggle('dark', isDark.value)
        localStorage.setItem('theme', theme)
    }

    const handleLogout = async () => {
        try {
            if (token) {
                await logoutRequest(token)
            }
        } catch (e) {
            console.warn('Logout request failed (ignored):', e)
        }

        localStorage.removeItem('token')
        sessionStorage.removeItem('token')

        router.replace('/login')
    }
</script>