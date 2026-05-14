<template>
  <div class="content">

    <h2 class="text-xl font-bold mb-4">Rewards</h2>

    <div class="font-semibold text-gray-700 dark:text-white mb-2">
      Create New Reward
    </div>

    <div class="bg-white rounded-xl shadow-sm p-4 mb-5 space-y-3">

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
          class="w-full border rounded-lg p-2 text-sm"
          placeholder="Reward name"
      />

      <input
          v-model="newReward.description"
          class="w-full border rounded-lg p-2 text-sm"
          placeholder="Reward description"
      />

      <div class="space-y-1">
        <label class="text-xs text-gray-500">Reward Type</label>
        <select
            v-model.number="newReward.reward_type_id"
            class="w-full border rounded-lg p-2 text-sm"
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
              class="w-full border rounded-lg p-2 text-sm"
          />
        </div>

        <div class="space-y-1">
          <label class="text-gray-500">Stock</label>
          <input
              type="number"
              v-model.number="newReward.stock"
              class="w-full border rounded-lg p-2 text-sm"
          />
        </div>

        <div class="space-y-1">
          <label class="text-gray-500">Max Amount</label>
          <input
              type="number"
              v-model.number="newReward.max_amount"
              class="w-full border rounded-lg p-2 text-sm"
          />
        </div>

      </div>

      <div class="flex justify-end mt-4">

        <button
            class="pushable save"
            :disabled="!canCreate"
            @click="createReward"
        >
          <span class="shadow"></span>
          <span class="edge"></span>

          <span class="front">
            <i class="fa-solid fa-plus"></i>
            Create
          </span>
        </button>

      </div>

    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>

    <div v-else>

      <div class="font-semibold text-gray-700 dark:text-white mb-2">
        Existing Rewards
      </div>

      <div
          v-for="r in rewards"
          :key="r.id"
          class="reward-card flex items-start gap-4 sm:gap-5 p-3 sm:p-4"
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

        <div class="flex-1 space-y-3 sm:space-y-4">

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">

            <div class="space-y-1">
              <label class="text-gray-500 text-xs">Name</label>
              <input
                  v-model="r.name"
                  class="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            <div class="space-y-1">
              <label class="text-gray-500 text-xs">Description</label>
              <input
                  v-model="r.description"
                  class="w-full border rounded-lg p-2 text-sm"
              />
            </div>

            <div class="space-y-1">
              <label class="text-gray-500 text-xs">Type</label>
              <select
                  v-model.number="r.rewardTypeId"
                  class="w-full border rounded-lg p-2 text-sm"
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

            <div class="space-y-1">
              <label class="text-gray-500">Cost</label>
              <input v-model.number="r.cost" type="number" class="w-full border rounded-lg p-2 text-sm"/>
            </div>

            <div class="space-y-1">
              <label class="text-gray-500">Stock</label>
              <input v-model.number="r.stock" type="number" class="w-full border rounded-lg p-2 text-sm"/>
            </div>

            <div class="space-y-1">
              <label class="text-gray-500">Max Amount</label>
              <input v-model.number="r.maxAmount" type="number" class="w-full border rounded-lg p-2 text-sm"/>
            </div>

          </div>

          <div class="flex justify-end gap-2 mt-3">

            <button class="pushable update" @click="saveReward(r)">
              <span class="shadow"></span>
              <span class="edge"></span>
              <span class="front">
              <i class="fa-solid fa-floppy-disk"></i>
              Save
            </span>
            </button>

            <button class="pushable delete" @click="removeReward(r)">
              <span class="shadow"></span>
              <span class="edge"></span>
              <span class="front">
              <i class="fa-solid fa-trash"></i>
              Delete
            </span>
            </button>

          </div>

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
                description: newReward.value.description,
                rewardType: rewardTypes.value.find(
                    t => t.id === newReward.value.reward_type_id
                ),
                cost: newReward.value.cost,
                stock: newReward.value.stock,
                maxAmount: newReward.value.max_amount,
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
            showToast('Create action failed: ' + (e?.message || 'Unknown error'), 'error')
        }
    }

    const saveReward = async (reward) => {
        try {
            await updateReward(reward.id, reward, token)

            showToast('Reward updated', 'success')
        } catch (e) {
            showToast('Update action failed: ' + (e?.message || 'Unknown error'), 'error')
        }
    }

    const removeReward = async (reward) => {
        try {
            await deleteReward(reward.id, token)

            rewards.value = rewards.value.filter(r => r.id !== reward.id)

            showToast('Reward removed', 'success')
        } catch (e) {
            showToast('Remove action failed: ' + (e?.message || 'Unknown error'), 'error')
        }
    }
</script>