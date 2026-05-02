<template>
  <div class="content">

    <h2 class="text-xl font-bold mb-4">Rewards</h2>

    <!-- CREATE TITLE -->
    <div class="font-semibold text-gray-700 dark:text-white mb-2">
      Create New Reward
    </div>

    <!-- CREATE NEW -->
    <div class="reward-card mb-4 flex flex-col gap-3">

      <!-- AVATAR SELECT -->
      <div class="space-y-1">
        <label class="text-xs text-gray-500">Icon</label>

        <div class="flex gap-2 flex-wrap">
          <button
              v-for="a in rewardAvatars"
              :key="a"
              @click="newReward.avatar = a"
              class="text-xl p-2 rounded border"
              :class="newReward.avatar === a ? 'border-blue-500' : 'border-transparent'"
          >
            {{ a }}
          </button>
        </div>
      </div>

      <!-- NAME -->
      <input
          v-model="newReward.name"
          class="w-full border rounded p-2 text-sm"
          placeholder="Reward name"
      />

      <!-- TYPE -->
      <div class="space-y-1">
        <label class="text-xs text-gray-500">Reward Type</label>
        <select
            v-model="newReward.reward_type_name"
            class="w-full border rounded p-2 text-xs"
        >
          <option value="voucher">voucher</option>
          <option value="food">food</option>
          <option value="experience">experience</option>
          <option value="merch">merch</option>
        </select>
      </div>

      <!-- NUMERIC FIELDS -->
      <div class="grid grid-cols-3 gap-2 text-xs items-end">

        <div class="space-y-1">
          <label class="text-gray-500">Cost</label>
          <input
              type="number"
              v-model.number="newReward.cost"
              class="w-full border rounded p-2"
          />
        </div>

        <div class="space-y-1">
          <label class="text-gray-500">Stock</label>
          <input
              type="number"
              v-model.number="newReward.stock"
              class="w-full border rounded p-2"
          />
        </div>

        <div class="space-y-1">
          <label class="text-gray-500">Max</label>
          <input
              type="number"
              v-model.number="newReward.max_amount"
              class="w-full border rounded p-2"
          />
        </div>

      </div>

      <!-- CREATE BUTTON -->
      <button
          class="redeem-btn text-xs w-full disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canCreate"
          @click="createReward"
      >
        Create Reward
      </button>

    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>

    <!-- LIST -->
    <div v-else class="space-y-3">

      <div class="font-semibold text-gray-700 dark:text-white mb-2">
        Existing Rewards
      </div>

      <div
          v-for="r in rewards"
          :key="r.id"
          class="reward-card flex items-start gap-3"
      >

        <!-- AVATAR -->
        <div class="text-3xl mt-1">
          {{ r.avatar || '🎁' }}
        </div>

        <!-- EDIT FIELDS -->
        <div class="flex-1 space-y-2">

          <input
              v-model="r.name"
              class="w-full border rounded p-1 text-sm font-semibold"
          />

          <!-- TYPE -->
          <div>
            <label class="text-gray-500 text-xs">Type</label>
            <select
                v-model="r.reward_type_name"
                class="w-full border rounded p-1 text-xs"
            >
              <option value="voucher">voucher</option>
              <option value="food">food</option>
              <option value="experience">experience</option>
              <option value="merch">merch</option>
            </select>
          </div>

          <!-- NUMBERS -->
          <div class="grid grid-cols-3 gap-2 text-xs">

            <div>
              <label class="text-gray-500">Cost</label>
              <input v-model.number="r.cost" type="number" class="w-full border rounded p-1"/>
            </div>

            <div>
              <label class="text-gray-500">Stock</label>
              <input v-model.number="r.stock" type="number" class="w-full border rounded p-1"/>
            </div>

            <div>
              <label class="text-gray-500">Max</label>
              <input v-model.number="r.max_amount" type="number" class="w-full border rounded p-1"/>
            </div>

          </div>

        </div>

        <!-- ACTIONS -->
        <div class="flex flex-col gap-2 mt-1">
          <button class="redeem-btn text-xs" @click="saveReward(r)">
            Save
          </button>
          <button
              class="need-points-btn text-xs"
              @click="removeReward(r)"
          >
            Delete
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { getRewards, createReward as apiCreateReward, updateReward, deleteReward  } from '../../services/api'

    const rewards = ref([])
    const loading = ref(true)
    const token = localStorage.getItem('token')

    const rewardAvatars = ['☕', '🎟️', '⏰', '🪑', '🍔', '🎮', '📚', '🛍️']

    const newReward = ref({
        name: '',
        reward_type_name: 'voucher',
        cost: 0,
        stock: 0,
        max_amount: 1,
        avatar: '☕'
    })

    const canCreate = computed(() => {
        const r = newReward.value

        return (
            r.name?.trim() &&
            r.reward_type_name &&
            r.cost > 0 &&
            r.stock > 0 &&
            r.max_amount >= 0
        )
    })

    onMounted(async () => {
        try {
            loading.value = true
            const res = await getRewards(token)

            rewards.value = (res.rewards || res).map(r => ({
                avatar: '🎁',
                ...r
            }))
        } finally {
            loading.value = false
        }
    })

    const createReward = async () => {
        try {
            const res = await apiCreateReward(newReward.value, token)

            rewards.value.unshift({
                avatar: newReward.value.avatar,
                ...res.reward
            })

            newReward.value = {
                name: '',
                reward_type_name: 'voucher',
                cost: 0,
                stock: 0,
                max_amount: 1,
                avatar: '☕'
            }
        } catch (e) {
            console.error(e)
        }
    }

    const saveReward = async (reward) => {
        try {
            await updateReward(reward.id, reward, token)
        } catch (e) {
            console.error(e)
        }
    }

    const removeReward = async (reward) => {
        try {
            await deleteReward(reward.id, token)

            rewards.value = rewards.value.filter(r => r.id !== reward.id)
        } catch (e) {
            console.error(e)
        }
    }
</script>