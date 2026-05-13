<template>
  <div class="content">

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="mt-3 text-sm text-gray-500">Loading rewards...</p>
    </div>

    <div v-else>

      <div class="balance-card">
        <span>Your Points</span>
        <span class="balance">{{ userPoints }}</span>
      </div>

      <RedeemedRewards
          :rewards="activeRedeemedRewards"
      />

      <AvailableRewards
          :rewards="rewards"
          :redeemedRewards="redeemedRewards"
          :userPoints="userPoints"
          :rewardTypes="rewardTypes"
          @redeemed="handleRewardRedeemed"
      />

      <UsedRewards
          :rewards="usedRewards"
      />

    </div>

  </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import {
        getMe,
        getRewards,
        getRewardTypes,
        getRedeemedRewards
    } from "../../services/api"

    import AvailableRewards from "./Rewards/AvailableRewards.vue"
    import RedeemedRewards from "./Rewards/RedeemedRewards.vue"
    import UsedRewards from "./Rewards/UsedRewards.vue"

    const rewardTypes = ref([])
    const rewards = ref([])
    const redeemedRewards = ref([])
    const currentUserId = ref(null)

    const activeRedeemedRewards = computed(() => {
        return redeemedRewards.value.filter(
            reward => reward.isUsed !== true
        )
    })

    const usedRewards = computed(() => {
        return redeemedRewards.value.filter(
            reward => reward.isUsed === true
        )
    })

    const loading = ref(true)
    const userPoints = ref(0)

    const token = localStorage.getItem('token')

    onMounted(async () => {

        try {

            loading.value = true

            const [
                rewardsRes,
                me,
                typesRes
            ] = await Promise.all([
                getRewards(token, { available_only: true }),
                getMe(token),
                getRewardTypes(token)
            ])

            userPoints.value = me.points
            currentUserId.value = me.id

            const redeemedRes = await getRedeemedRewards(token, currentUserId.value)

            rewards.value = rewardsRes.rewards || []
            rewardTypes.value = typesRes.reward_types || []
            redeemedRewards.value = redeemedRes.rewards || []

        } finally {

            loading.value = false
        }
    })

    const handleRewardRedeemed = ({ reward }) => {

        userPoints.value -= reward.cost

        const existing = redeemedRewards.value.find(
            r => r.reward.id === reward.id && r.isUsed !== true
        )

        if (existing) {

            existing.amount += 1
            existing.redeemedAt = new Date().toISOString()
            existing.justUpdated = true
            existing.lastAddedAmount = 1

            setTimeout(() => {
                existing.justUpdated = false
            }, 900)

            return
        }

        redeemedRewards.value.unshift({
            id: Date.now(),
            amount: 1,
            redeemedAt: new Date().toISOString(),
            isUsed: false,
            reward: {
                id: reward.id,
                name: reward.name,
                picture_filename: reward.picture.fileName
            }
        })
    }
</script>