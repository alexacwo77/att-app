<template>
  <div class="content">

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-3 text-sm text-gray-500">Loading employees...</p>
    </div>

    <div v-else>

      <div class="mb-2 text-lg font-semibold">
        Existing Employees
      </div>

      <div
          v-for="u in employees"
          :key="u.id"
          class="bg-white rounded-xl shadow-sm p-4 mb-3"
      >

        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="font-semibold text-gray-900">
              {{ u.nickname || u.name }}
            </div>
            <div class="text-xs text-gray-500">
              ID: {{ u.id }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2">

          <div class="space-y-1">
            <label class="text-gray-500 text-xs mr-1">Name</label>
            <div class="text-gray-700 text-sm">
              <span class="font-semibold">{{ u.name }}</span>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-gray-500 text-xs mr-1">Nickname</label>
            <div class="text-gray-700 text-sm">
              <span class="font-semibold">{{ u.nickname }}</span>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-gray-500 text-xs mr-1">Email</label>
            <div class="text-gray-700 text-sm">
              <span class="font-semibold">{{ u.email }}</span>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-gray-500 text-xs mr-1">Points</label>
            <div class="text-gray-700 text-sm">
              <span class="font-semibold">{{ u.points }}</span>
            </div>
          </div>

          <div
              v-if="getRewardsByUser(u.id).length"
              class="mt-4 border-t pt-3"
          >

            <div class="text-sm font-semibold text-gray-700 mb-2">
              Rewards
            </div>

            <div
                v-for="rewardItem in getRewardsByUser(u.id)"
                :key="rewardItem.id"
                class="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-2"
            >

              <div>

                <div class="font-medium text-sm">
                  {{ rewardItem.reward.name }}
                </div>

                <div class="text-xs text-gray-500">
                  Amount: {{ rewardItem.amount }}
                </div>

                <div class="text-xs text-gray-500">
                  Redeemed:
                  {{ formatDate(rewardItem.redeemedAt) }}
                </div>

                <div v-if="rewardItem.isUsed"
                    class="text-xs font-semibold mt-1 text-gray-400"
                >
                  Used:
                  {{ formatDate(rewardItem.usedAt) }}
                </div>

              </div>

              <button
                  v-if="rewardItem.isUsed !== true"
                  @click="markRewardUsed(rewardItem)"
                  class="pushable update"
              >
                <span class="shadow"></span>
                <span class="edge"></span>

                <span class="front">
                  <i
                      v-if="!loadingButtons[rewardItem.id]"
                      class="fa-solid fa-check-to-slot"
                  ></i>

                  <span v-if="!loadingButtons[rewardItem.id]">
                    Mark Used
                  </span>

                  <span v-else class="spinner"></span>
                </span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import {
        getEmployees,
        updateUserReward,
        getRedeemedRewards
    } from '../../services/api'
    import { useToast } from '../../composables/useToast'

    const { showToast } = useToast()
    const employees = ref([])
    const userRewards = ref([])
    const loading = ref(true)
    const loadingButtons = ref({})
    const token = localStorage.getItem('token')
    const originalEmployees = ref([])

    const newUser = ref({
        name: '',
        nickname: '',
        password: '',
        email: '',
        role_name: 'employee',
        points: 0
    })

    const canCreate = computed(() => {
        return (
            newUser.value.name?.trim() &&
            newUser.value.email?.trim()
        )
    })

    const getRewardsByUser = (userId) => {

        return userRewards.value.filter(
            reward => reward.userId === userId
        )
    }

    onMounted(async () => {
        try {
            loading.value = true

            const [
                employeesRes,
                rewardsRes
            ] = await Promise.all([
                getEmployees(token),
                getRedeemedRewards(token)
            ])

            employees.value = employeesRes.employees

            originalEmployees.value = JSON.parse(
                JSON.stringify(employeesRes.employees)
            )

            userRewards.value = rewardsRes.rewards || []

        } finally {
            loading.value = false
        }
    })

    const markRewardUsed = async (rewardItem) => {

        loadingButtons.value[rewardItem.id] = true

        try {

            await updateUserReward(
                rewardItem.id,
                {
                    is_used: true
                },
                token
            )

            rewardItem.isUsed = true
            rewardItem.usedAt = new Date().toISOString()

            showToast(
                'Reward marked as used',
                'success'
            )

        } catch (e) {

            showToast(
                'Failed to update reward',
                'error'
            )
        } finally {
            loadingButtons.value[rewardItem.id] = false
        }
    }

    const formatDate = (d) => {

        return new Date(d).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }
</script>