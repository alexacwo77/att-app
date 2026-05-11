<template>
  <div class="content">

    <div class="profile-header">
      <div class="large-avatar">
        {{ selectedAvatar }}
      </div>

      <div class="mt-2 text-sm text-blue-600 cursor-pointer">
        Change Avatar
      </div>

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

    <div class="settings-section">
      <div class="section-title">Security</div>

      <div class="setting-item flex justify-between items-center">
        <span>Change Password</span>
        <button class="text-blue-600 text-sm">
          Update
        </button>
      </div>
    </div>

    <div class="settings-section">
      <div class="section-title">Appearance</div>

      <div class="setting-item">
        <span>{{ isDark ? 'Dark Mode' : 'Light Mode' }}</span>

        <div
            class="toggle-btn"
            :class="{ active: isDark }"
            @click="toggleTheme"
        >
          <div class="icon">
            <i :class="isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'"></i>
          </div>
        </div>

      </div>
    </div>

    <div class="settings-section">
      <div class="section-title">Account</div>

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

    const token = localStorage.getItem('token')

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

    // TODO: fix all the user interface to handle light-dark theme
    const toggleTheme = () => {
        isDark.value = !isDark.value

        document.documentElement.classList.toggle('dark', isDark.value)
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
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

        router.replace('/login')
    }
</script>

<style scoped>
  .toggle-btn {
    position: relative;
    height: 30px;
    width: 60px;
    background: #e2e2e2;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.4s ease;
  }

  .toggle-btn.active {
    background-color: #667eea;
  }

  .toggle-btn .icon {
    position: absolute;
    top: 50%;
    left: -1px;
    transform: translateY(-50%);
    height: 40px;
    width: 40px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f3f3f3;
    background: #667eea;
    border: 1px solid #e2e2e2;
    border-radius: 50%;
    transition: all 0.6s ease;
  }

  .toggle-btn.active .icon {
    left: calc(100% - 39px);
    color: #f3f3f3;
    border: 1px solid #c6c6c6;
  }

  .toggle-btn .icon i {
    transition: transform 0.6s ease;
  }

  .toggle-btn.active .icon i {
    transform: rotate(190deg);
  }

  .toggle-btn:not(.active) .icon i {
    transform: rotate(0deg);
  }
</style>