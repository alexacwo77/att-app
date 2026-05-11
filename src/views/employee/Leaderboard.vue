<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { getEmployees, getMe } from '../../services/api'

    const employees = ref([])
    const currentUser = ref(null)
    const loading = ref(true)

    const token = localStorage.getItem('token')

    onMounted(async () => {
        try {
            loading.value = true

            const [employeesRes, meRes] = await Promise.all([
                getEmployees(token),
                getMe(token)
            ])

            employees.value = employeesRes.employees
            currentUser.value = meRes
        } finally {
            loading.value = false
        }
    })

    const sortedEmployees = computed(() => {
        return [...employees.value].sort((a, b) => b.points - a.points)
    })

    const currentRank = computed(() => {
        if (!currentUser.value) return null

        const index = sortedEmployees.value.findIndex(
            u => u.id === currentUser.value.id
        )

        return index !== -1 ? index + 1 : null
    })
</script>

<template>
  <div class="content">

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-3 text-sm text-gray-500">Loading leaderboard...</p>
    </div>

    <div v-else>

      <div class="user-card">
        <div class="flex justify-between">
          <span>Your Stats</span>
          <span>🏆 Rank #{{ currentRank }}</span>
        </div>

        <div class="user-stats">
          <span class="rank-badge">{{ currentUser?.points }} pts</span>
          <span v-if="currentRank > 1">
            +{{ sortedEmployees[currentRank - 2]?.points - currentUser.points }} to rank #{{ currentRank - 1 }}
          </span>
        </div>
      </div>

      <div
          v-for="(user, index) in sortedEmployees"
          :key="user.id"
          class="leaderboard-item"
          :class="user.id === currentUser?.id ? 'bg-blue-50 rounded-lg my-1 p-3' : ''"
      >
        <span class="rank">{{ index + 1 }}</span>

        <div
            class="avatar"
            :class="{
            gold: index === 0,
            silver: index === 1,
            bronze: index === 2,
            purple: index > 2
          }"
        >
          <span v-if="index === 0">🥇</span>
          <span v-else-if="index === 1">🥈</span>
          <span v-else-if="index === 2">🥉</span>
          <span v-else>👤</span>
        </div>

        <div class="user-info">
          <div class="nickname">
            {{ user.id === currentUser?.id ? 'You (' + user.nickname + ')' : user.nickname }}
          </div>
        </div>

        <span class="points">{{ user.points }} pts</span>
      </div>

    </div>
  </div>
</template>