<template>
  <div class="content">

    <h2 class="text-xl font-bold mb-4">Rewards</h2>

    <div class="font-semibold text-gray-700 dark:text-white mb-2">
      Create New Reward
    </div>

    <div class="reward-card mb-4 flex flex-col gap-3">

      <div class="space-y-1">
        <label class="text-xs text-gray-500">Icon</label>

        <div class="flex gap-2 flex-wrap">
          <button
              v-for="picture in rewardPictures"
              :key="picture.id"
              @click="newReward.picture = picture"
              class="p-1 rounded border"
              :class="newReward.picture?.id === picture.id
                ? 'border-blue-500'
                : 'border-transparent'"
                >
            <img
                :src="`${picture.fileName}`"
                class="w-10 h-10"
            />
          </button>
        </div>
      </div>

      <input
          v-model="newReward.name"
          class="w-full border rounded p-2 text-sm"
          placeholder="Reward name"
      />

      <input
          v-model="newReward.description"
          class="w-full border rounded p-2 text-sm"
          placeholder="Reward description"
      />

      <div class="space-y-1">
        <label class="text-xs text-gray-500">Reward Type</label>
        <select
            v-model="newReward.reward_type_id"
            class="w-full border rounded p-1 text-xs"
        >
          <option
              v-for="type in rewardTypes"
              :key="type.id"
              :value="type.id"
          >
            {{ type.name }}
          </option>
        </select>
      </div>

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

      <button
          class="redeem-btn text-xs w-full disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canCreate"
          @click="createReward"
      >
        Create Reward
      </button>

    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>

    <div v-else class="space-y-3">

      <div class="font-semibold text-gray-700 dark:text-white mb-2">
        Existing Rewards
      </div>

      <div
          v-for="r in rewards"
          :key="r.id"
          class="reward-card flex items-start gap-3"
      >

        <div class="mt-1">
          <img
              v-if="r.picture?.fileName"
              :src="`${r.picture.fileName}`"
              class="w-12 h-12"
          />

          <img
              v-else
              src="/default-reward.svg"
              class="w-12 h-12"
          />
        </div>

        <div class="flex-1 space-y-2">

          <input
              v-model="r.name"
              class="w-full border rounded p-1 text-sm font-semibold"
          />

          <div>
            <label class="text-gray-500 text-xs">Type</label>
            <select
                v-model="r.reward_type_id"
                class="w-full border rounded p-1 text-xs"
            >
              <option
                  v-for="type in rewardTypes"
                  :key="type.id"
                  :value="type.id"
              >
                {{ type.name }}
              </option>
            </select>
          </div>

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
    import {
        getRewards,
        createReward as apiCreateReward,
        updateReward,
        deleteReward,
        getRewardTypes,
        getPictures
    } from '../../services/api'
    import { useToast } from '../../composables/useToast'

    const { showToast } = useToast()
    const rewardTypes = ref([])
    const rewards = ref([])
    const loading = ref(true)
    const token = localStorage.getItem('token')

    const rewardPictures = ref([])

    const newReward = ref({
        name: '',
        description: '',
        reward_type_id: null,
        cost: 0,
        stock: 0,
        max_amount: 1,
        picture_id: null,
        picture: null
    })

    const canCreate = computed(() => {
        const r = newReward.value

        return (
            r.name?.trim() &&
            r.reward_type_id &&
            r.cost > 0 &&
            r.stock > 0 &&
            r.max_amount >= 0
        )
    })

    onMounted(async () => {
        loading.value = true

        try {
            const typesRes = await getRewardTypes(token)
            rewardTypes.value = typesRes.reward_types

            const rewardsRes = await getRewards(token)

            rewards.value = rewardsRes.rewards

            const picturesRes = await getPictures(token, {
                type: 'REWARD_AVATAR'
            })

            rewardPictures.value = picturesRes.pictures || []
        } finally {
            loading.value = false
        }
    })

    const createReward = async () => {
        try {
            const payload = {
                ...newReward.value,
                picture_id: newReward.value.picture?.id || null
            }

            const res = await apiCreateReward(payload, token)

            const rewardId = res.data.reward_id

            rewards.value.unshift({
                id: rewardId,
                name: newReward.value.name,
                reward_type_id: newReward.value.reward_type_id,
                cost: newReward.value.cost,
                stock: newReward.value.stock,
                max_amount: newReward.value.max_amount,
                picture: newReward.value.picture
            })

            newReward.value = {
                name: '',
                description: '',
                reward_type_id: null,
                cost: 0,
                stock: 0,
                redeemed_amount: 0,
                max_amount: 1,
                picture_id: null,
                picture: null
            }

            showToast('Reward created', 'success')

        } catch (e) {
            showToast('Create failed: ' + (e?.message || 'Unknown error'), 'error')
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