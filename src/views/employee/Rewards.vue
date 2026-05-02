<template>
  <div class="content">

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-3 text-sm text-gray-500">Loading rewards...</p>
    </div>

    <div v-else>

      <!-- BALANCE -->
      <div class="balance-card">
        <span>Your Points</span>
        <span class="balance">{{ userPoints }}</span>
      </div>

      <!-- FILTERS -->
      <div class="filter-chips">
        <span
            class="chip"
            :class="{ active: activeFilter === 'all' }"
            @click="activeFilter = 'all'"
        >
          All
        </span>

        <span
            class="chip"
            v-for="type in rewardTypes"
            :key="type"
            :class="{ active: activeFilter === type }"
            @click="activeFilter = type"
        >
          {{ type }}
        </span>
      </div>

      <!-- REWARDS -->
      <div
          v-for="reward in filteredRewards"
          :key="reward.id"
          class="reward-card"
      >
        <!-- LEFT ICON -->
        <div class="reward-icon">
          <img
              v-if="reward.picture_filename"
              :src="reward.picture_filename"
              class="w-10 h-10 object-cover rounded"
          />
        </div>

        <!-- RIGHT CONTENT -->
        <div class="reward-details">

          <!-- TITLE -->
          <div class="reward-title">
            {{ reward.name }}
          </div>

          <!-- COST -->
          <div class="reward-cost">
            {{ reward.cost }} pts
          </div>

          <!-- ACTIONS -->
          <div class="reward-actions">
            <button
                v-if="userPoints >= reward.cost"
                class="redeem-btn"
                @click="redeem(reward)"
            >
              Redeem
            </button>

            <button
                v-else
                class="need-points-btn"
            >
              Need {{ reward.cost - userPoints }} more
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { getRewards, getMe, redeemReward } from '../../services/api'

    const rewards = ref([])
    const loading = ref(true)
    const userPoints = ref(0)
    const activeFilter = ref('all')

    const token = localStorage.getItem('token')

    onMounted(async () => {
        try {
            loading.value = true

            const [rewardsRes, me] = await Promise.all([
                getRewards(token),
                getMe(token)
            ])

            rewards.value = rewardsRes.rewards || rewardsRes
            userPoints.value = me.points
        } finally {
            loading.value = false
        }
    })

    const rewardTypes = computed(() => {
        const types = rewards.value.map(r => r.reward_type_name)
        return [...new Set(types)]
    })

    const filteredRewards = computed(() => {
        if (activeFilter.value === 'all') return rewards.value
        return rewards.value.filter(
            r => r.reward_type_name === activeFilter.value
        )
    })

    const redeem = async (reward) => {
        try {
            await redeemReward(reward.id, 1, token)
            alert('Redeemed!')
        } catch (e) {
            alert(e.message)
        }
    }
</script>