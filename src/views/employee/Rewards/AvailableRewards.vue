<template>
  <div class="content">

    <div class="section-header">
      Available Rewards
    </div>

    <div class="filter-chips">

      <span
          v-if="filteredRewards > 0"
          class="chip"
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
      >
        All
      </span>

      <span
          v-for="type in visibleRewardTypes"
          :key="type.id"
          class="chip"
          :class="{ active: activeFilter === type.id }"
          @click="activeFilter = type.id"
      >
        {{ type.name }}
      </span>

    </div>

    <div
        v-for="reward in filteredRewards"
        :key="reward.id"
        class="reward-card"
    >
      <div class="reward-icon">

        <img
            v-if="reward.picture.fileName"
            :src="reward.picture.fileName"
            class="w-10 h-10 object-cover rounded"
        />

      </div>

      <div class="reward-details">

        <div class="reward-title">
          {{ reward.name }}
        </div>

        <div class="reward-cost">
          {{ reward.cost }} pts
        </div>

        <div class="reward-actions">

          <button
              v-if="reward.stock <= 0 || isUserMaxed(reward)"
              class="pushable delete"
              disabled
          >
            <span class="shadow"></span>
            <span class="edge"></span>

            <span class="front">
              <i class="fa-solid fa-ban"></i>
              Not available
            </span>
          </button>

          <button
              v-else-if="userPoints < reward.cost"
              class="pushable delete"
              disabled
          >
            <span class="shadow"></span>
            <span class="edge"></span>

            <span class="front">
              <i class="fa-solid fa-coins"></i>
              Need {{ reward.cost - userPoints }} more
            </span>
          </button>

          <RedeemButton
              v-else
              :isDisabled="reward.stock <= 0 || userPoints < reward.cost"
              @redeem="(ctrl) => redeem(reward, ctrl)"
          />

        </div>

      </div>
    </div>

    <div
        v-if="filteredRewards.length === 0"
        class="text-center text-gray-500 py-10"
    >
      Nothing is here
    </div>

  </div>
</template>

<script setup>
    import { ref, computed } from "vue"

    import { redeemReward } from "../../../services/api"

    import RedeemButton from "./RedeemButton.vue"

    const props = defineProps({
        rewards: {
            type: Array,
            default: () => []
        },
        redeemedRewards: {
            type: Array,
            default: () => []
        },
        rewardTypes: {
            type: Array,
            default: () => []
        },
        userPoints: {
            type: Number,
            default: 0
        }
    })

    const emit = defineEmits([
        "redeemed"
    ])

    const activeFilter = ref("all")

    const token = localStorage.getItem("token")

    const visibleRewardTypes = computed(() => {
        const availableRewards = props.rewards.filter(reward => {
            return !isUserMaxed(reward);
        })

        return props.rewardTypes.filter(type =>
            availableRewards.some(
                reward => reward.rewardTypeId === type.id
            )
        )
    })

    const filteredRewards = computed(() => {

        const base = props.rewards.filter(reward => {
            return !isUserMaxed(reward);
        })

        if (activeFilter.value === "all") {
            return base
        }

        return base.filter(
            r => r.rewardTypeId === activeFilter.value
        )
    })

    const isUserMaxed = (reward) => {
        const userCount = getUserRedeemedCount(reward.id)
        return userCount >= reward.maxAmount
    }

    const getUserRedeemedCount = (rewardId) => {
        return props.redeemedRewards.filter(r =>
            r.reward.id === rewardId
        ).reduce((sum, r) => sum + r.amount, 0)
    }

    const redeem = async (reward, ctrl) => {

        try {

            const res = await redeemReward(
                reward.id,
                1,
                token
            )

            reward.stock = res.updated_amount

            ctrl.onSuccess()

            emit("redeemed", {
                reward
            })

        } catch (e) {

            ctrl.onError()
        }
    }
</script>