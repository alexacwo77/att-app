<template>
  <button
      class="redeem-btn"
      :class="{ loading, done, disabled: isDisabled }"
      :disabled="isDisabled || loading"
      @click="handleClick"
  >
    <span class="icon">
      <svg viewBox="0 0 16 16" class="circle">
        <circle cx="8" cy="8" r="7.5" />
      </svg>

      <svg viewBox="0 0 12 12" class="check">
        <path d="M2 6 L5 9 L10 3" />
      </svg>
    </span>

    <!-- TEXT -->
    <span class="label">
      <span v-if="!loading && !done">Redeem</span>

      <span v-else-if="loading" class="dots">
        <i></i><i></i><i></i>
      </span>

      <span v-else>Redeemed!</span>
    </span>
  </button>
</template>

<script setup>
    import { ref } from 'vue'

    const props = defineProps({
        isDisabled: Boolean
    })

    const emit = defineEmits(['redeem'])

    const loading = ref(false)
    const done = ref(false)

    const handleClick = () => {
        if (loading.value || props.isDisabled) return

        loading.value = true

        emit('redeem', {
            onSuccess: () => {
                loading.value = false
                done.value = true

                setTimeout(() => {
                    done.value = false
                }, 1600)
            },
            onError: () => {
                loading.value = false
            }
        })
    }
</script>

<style scoped>
  .redeem-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 8px 15px;
    border-radius: 20px;

    font-size: 13px;
    font-weight: 600;

    border: none;
    white-space: nowrap;

    cursor: pointer;
    opacity: 0.8;

    background: #667eea;
    color: #fff;

    transition: all 0.5s ease;
  }

  .redeem-btn.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .redeem-btn.loading {
    background: #a3bffa;
  }

  .redeem-btn.done {
    background: #48bb78;
  }

  .icon {
    display: inline-block;
    position: relative;

    width: 0;
    height: 18px;

    overflow: hidden;

    margin-right: 0;
    transition: width 0.6s ease;
  }

  .redeem-btn.done .icon {
    width: 18px;
    margin-right: 6px;
  }

  .icon svg {
    position: absolute;
    inset: 0;

    width: 18px;
    height: 18px;

    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;

    transition: all 0.5s ease;
  }

  .circle {
    opacity: 0;
    transform: scale(0.6);
  }

  .redeem-btn.done .circle {
    opacity: 1;
    transform: scale(1);
    color: rgba(255, 255, 255, 0.35);
  }

  .check {
    opacity: 0;
    transform: scale(0.4);
  }

  .redeem-btn.done .check {
    opacity: 1;
    transform: scale(1);
    transition: all 0.5s ease 0.25s;
  }

  .label {
    display: inline-flex;
    align-items: center;
  }

  .dots {
    display: inline-flex;
    gap: 3px;
    align-items: center;
  }

  .dots i {
    width: 5px;
    height: 5px;
    background: currentColor;
    border-radius: 50%;
    animation: bounce 1.6s infinite ease-in-out;
  }

  .dots i:nth-child(2) { animation-delay: 0.15s; }
  .dots i:nth-child(3) { animation-delay: 0.3s; }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>