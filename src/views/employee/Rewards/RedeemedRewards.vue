<template>
  <div class="redeemed-section">

    <div class="section-header">
      Redeemed Rewards
    </div>

    <div
        v-if="loading"
        class="text-center py-10 text-gray-500"
    >
      Loading redeemed rewards...
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
          class="redeemed-card"
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

      </div>

    </transition-group>

    <div
        v-else
        class="empty-state"
    >
      No redeemed rewards yet
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

  .redeemed-card {
    position: relative;

    background: #fff;
    border-radius: 16px;
    padding: 14px;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    border: 1px solid #edf2f7;

    overflow: hidden;

    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        background-color 1.2s ease,
        border-color 1.2s ease;
  }

  .redeemed-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  }

  .image-wrapper {
    width: 64px;
    height: 64px;
    margin-bottom: 12px;
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
    color: #718096;
    margin-bottom: 6px;
  }

  .reward-date {
    font-size: 11px;
    color: #a0aec0;
  }

  .empty-state {
    text-align: center;
    padding: 30px 0;
    color: #a0aec0;
  }

  /* =========================
     NEW CARD ENTER
     ========================= */

  .redeemed-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
  }

  .redeemed-enter-active {
    background: #c6f6d5;
    transition:
        opacity 1s ease,
        transform 1s ease;
  }

  .redeemed-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .redeemed-enter-from.redeemed-card {
    border-color: #9ae6b4;
  }

  .redeemed-enter-to.redeemed-card {
    border-color: #edf2f7;
  }

  .redeemed-move {
    transition: transform 0.4s ease;
  }

  /* =========================
     PLUS FLY ANIMATION
     ========================= */

  .plus-fly {
    position: absolute;

    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);

    font-size: 34px;
    font-weight: 800;

    color: #38a169;

    pointer-events: none;
    z-index: 5;

    text-shadow:
        0 2px 10px rgba(56, 161, 105, 0.35);
    animation: flyPlus 1200ms ease forwards;
  }

  @keyframes flyPlus {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.6);
    }

    5% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    100% {
      opacity: 0;
      transform: translate(46px, -46px) scale(1.4);
    }
  }

  .plus-fly-enter-from {
    opacity: 0;
    transform:
        translate(-50%, -50%)
        scale(0.4);
  }

  .plus-fly-enter-active {
    transition:
        transform 0.9s cubic-bezier(.22,1,.36,1),
        opacity 0.9s ease;
  }

  .plus-fly-enter-to {
    opacity: 1;
    transform:
        translate(110%, -180%)
        scale(1);
  }

  .plus-fly-leave-active {
    transition:
        opacity 0.25s ease;
  }

  .plus-fly-leave-to {
    opacity: 0;
  }
</style>