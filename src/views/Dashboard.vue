<template>
  <div class="flex flex-col h-full">

    <div class="flex-1 overflow-y-auto flex justify-center">
      <div class="w-full max-w-3xl">
        <component :is="currentTabComponent" />
      </div>
    </div>

    <div class="border-t bg-white dark:bg-gray-800 flex justify-center">
      <div class="w-full max-w-3xl flex">
        <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="currentTab = tab.name"
            class="flex-1 p-3 text-sm text-center whitespace-nowrap"
            :class="currentTab === tab.name ? 'font-bold' : ''"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { getMe } from '../services/api'

    import AdminEmployees from '../views/admin/Employees.vue'
    import AdminRewards from '../views/admin/Rewards.vue'
    import AdminEvents from '../views/admin/Events.vue'
    import AdminSettings from '../views/admin/Settings.vue'

    import Leaderboard from '../views/employee/Leaderboard.vue'
    import EmployeeRewards from '../views/employee/Rewards.vue'
    import Settings from '../views/employee/Settings.vue'

    const role = ref(null)
    const currentTab = ref(null)
    const tabs = ref([])

    const token = localStorage.getItem('token')

    onMounted(async () => {
        const user = await getMe(token)
        role.value = user.role_name

        if (role.value === 'admin') {
            tabs.value = [
                { name: 'employees', label: 'Employees' },
                { name: 'rewards', label: 'Rewards' },
                { name: 'events', label: 'Events' },
                { name: 'settings', label: 'Settings' }
            ]
            currentTab.value = 'employees'
        } else {
            tabs.value = [
                { name: 'leaderboard', label: 'Leaderboard' },
                { name: 'rewards', label: 'Rewards' },
                { name: 'settings', label: 'Settings' }
            ]
            currentTab.value = 'leaderboard'
        }
    })

    const currentTabComponent = computed(() => {
        if (!role.value || !currentTab.value) return null

        const map = {
            admin: {
                employees: AdminEmployees,
                rewards: AdminRewards,
                events: AdminEvents,
                settings: AdminSettings
            },
            employee: {
                leaderboard: Leaderboard,
                rewards: EmployeeRewards,
                settings: Settings
            }
        }

        return map[role.value]?.[currentTab.value] || null
    })
</script>