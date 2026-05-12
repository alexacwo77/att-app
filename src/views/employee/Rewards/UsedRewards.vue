<template>
  <div class="redeemed-section">

    <div class="section-header">
      Used Rewards (Archive)
    </div>

    <div
        v-if="loading"
        class="text-center py-10 text-gray-500"
    >
      Loading used rewards...
    </div>

    <transition-group
        v-else-if="rewards.length > 0"
        name="redeemed"
        tag="div"
        class="redeemed-grid"
    >

      <div
          v-for="item in rewards"
          :key="item.id"
          class="used-card"
      >

        <!-- ✨ PLUS ANIMATION -->
        <transition name="plus-fly">
          <div
              v-if="item.justUpdated"
              class="plus-fly"
          >
            +{{ item.lastAddedAmount || 1 }}
          </div>
        </transition>

        <div class="image-wrapper">

          <img
              v-if="item.reward.picture_filename"
              :src="item.reward.picture_filename"
              class="reward-image"
          />

          <div
              v-else
              class="reward-placeholder"
          >
            🎁
          </div>

        </div>

        <div class="reward-name">
          {{ item.reward.name }}
        </div>

        <div class="reward-meta">
          {{ item.amount }} redeemed
        </div>

        <div class="reward-date">
          Redeemed on: {{ formatDate(item.redeemedAt) }}
        </div>

        <div class="reward-date">
          Used on: {{ formatDate(item.usedAt) }}
        </div>

      </div>

    </transition-group>

    <div
        v-else
        class="empty-state"
    >
      No used rewards yet
    </div>

  </div>
</template>

<script setup>
    const props = defineProps({
        rewards: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        }
    })

    const formatDate = (d) => {

        return new Date(d).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }
</script>

<style scoped>
  .redeemed-section {
    margin-bottom: 28px;
  }

  .redeemed-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
  }

  .used-card {
    position: relative;

    background: #f7fafc;
    border-radius: 16px;
    padding: 14px;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    border: 1px solid #e2e8f0;

    overflow: hidden;

    opacity: 0.82;

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        background-color 1.2s ease,
        border-color 1.2s ease,
        opacity 0.25s ease;
  }

  .used-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.04);
    opacity: 0.95;
  }

  .image-wrapper {
    width: 64px;
    height: 64px;
    margin-bottom: 12px;
  }

  .reward-image {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    object-fit: cover;

    filter: grayscale(100%) brightness(1.08);
    opacity: 0.8;
  }

  .reward-image,
  .reward-placeholder {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    object-fit: cover;
  }

  .reward-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;

    background: #edf2f7;

    font-size: 24px;
  }

  .reward-name {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 4px;
  }

  .reward-meta {
    font-size: 12px;
    color: #2d3748;
    margin-bottom: 6px;
  }

  .reward-date {
    font-size: 11px;
    color: #2d3748;
  }
</style>