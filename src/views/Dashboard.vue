<template>
  <div class="flex flex-col h-full">

    <div class="flex-1 overflow-y-auto flex justify-center">
      <div class="w-full max-w-3xl">
        <component :is="currentTabComponent" />
      </div>
    </div>

    <div class="bottom-nav">
      <button
          v-for="tab in tabs"
          :key="tab.name"
          class="nav-item"
          :class="{ active: currentTab === tab.name }"
          @click="currentTab = tab.name"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>

      <div
          class="indicator"
          :style="indicatorStyle"
      />
    </div>

  </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { getMe } from '../services/api'

    import SuperadminEmployees from '../views/superadmin/Employees.vue'
    import SuperadminRewards from '../views/superadmin/Rewards.vue'
    import SuperadminSettings from '../views/superadmin/Settings.vue'

    import AdminEmployees from '../views/admin/Employees.vue'
    import AdminEvents from '../views/admin/Events/Events.vue'
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

        if (role.value === 'superadmin') {
            tabs.value = [
                { name: 'superadmin_employees', label: 'Employees', icon: 'fa-solid fa-users' },
                { name: 'rewards', label: 'Rewards', icon: 'fa-solid fa-award' },
                { name: 'profile', label: 'Profile', icon: 'fa-solid fa-user' }
            ]
            currentTab.value = 'superadmin_employees'
        } else if (role.value === 'admin') {
            tabs.value = [
                { name: 'employees', label: 'Employees', icon: 'fa-solid fa-users' },
                { name: 'events', label: 'Events', icon: 'fa-solid fa-calendar-days' },
                { name: 'profile', label: 'Profile', icon: 'fa-solid fa-user' }
            ]
            currentTab.value = 'employees'
        } else {
            tabs.value = [
                { name: 'leaderboard', label: 'Leaderboard', icon: 'fa-solid fa-ranking-star' },
                { name: 'rewards', label: 'Rewards', icon: 'fa-solid fa-award' },
                { name: 'profile', label: 'Profile', icon: 'fa-solid fa-user' }
            ]
            currentTab.value = 'leaderboard'
        }
    })

    const activeIndex = computed(() =>
        tabs.value.findIndex(t => t.name === currentTab.value)
    )

    const indicatorStyle = computed(() => {
        const count = tabs.value.length || 1
        const index = activeIndex.value

        return {
            width: `${100 / count}%`,
            transform: `translateX(${index * 100}%)`
        }
    })

    const currentTabComponent = computed(() => {
        if (!role.value || !currentTab.value) return null

        const map = {
            superadmin: {
                superadmin_employees: SuperadminEmployees,
                rewards: SuperadminRewards,
                profile: SuperadminSettings
            },
            admin: {
                employees: AdminEmployees,
                events: AdminEvents,
                profile: AdminSettings
            },
            employee: {
                leaderboard: Leaderboard,
                rewards: EmployeeRewards,
                profile: Settings
            }
        }

        return map[role.value]?.[currentTab.value] || null
    })
</script>

<style scoped>
  .bottom-nav {
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);

    width: 90%;
    max-width: 420px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    background: #fff;
    border-radius: 22px;

    padding: 10px 6px;

    box-shadow: 0 10px 30px rgba(0,0,0,0.12);

    position: fixed;
    overflow: hidden;
  }

  /* each tab */
  .nav-item {
    flex: 1;
    background: none;
    border: none;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 4px;

    font-size: 12px;
    color: #9aa0a6;

    cursor: pointer;
    z-index: 2;
  }

  .nav-item i {
    font-size: 18px;
  }

  /* active state */
  .nav-item.active {
    color: #764ba2;
  }

  /* animated underline indicator */
  .indicator {
    position: absolute;
    bottom: 0;
    left: 0;

    height: 3px;

    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3px;

    transition: transform 0.3s ease;
  }
</style>