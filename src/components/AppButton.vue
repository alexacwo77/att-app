<template>
  <button
      class="pushable"
      :class="[variant, { disabled, loading }]"
      :disabled="disabled || loading"
      @click="handleClick"
  >
    <span class="shadow"></span>
    <span class="edge"></span>

    <span class="front">
      <i v-if="icon && !loading" :class="icon"></i>

      <span v-if="!loading">
        <slot />
      </span>

      <span v-else class="spinner"></span>
    </span>
  </button>
</template>

<script setup>
    const props = defineProps({
        variant: {
            type: String,
            default: 'save',
        },
        icon: String,
        loading: Boolean,
        disabled: Boolean,
    })

    const emit = defineEmits(['click'])

    const handleClick = (e) => {
        if (props.loading || props.disabled) return
        emit('click', e)
    }
</script>

<style scoped>

  /* =========================
     BASE BUTTON
  ========================= */

  .pushable {
    position: relative;
    background: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
    outline-offset: 4px;
    transition: filter 250ms;
    -webkit-tap-highlight-color: transparent;
  }

  .pushable:focus:not(:focus-visible) {
    outline: none;
  }

  .pushable:hover {
    filter: brightness(1.08);
  }

  /* =========================
     SHADOW (depth layer)
  ========================= */

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.25);
    filter: blur(2px);
    transform: translateY(3px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }

  /* =========================
     EDGE (3D side gradient)
  ========================= */

  .edge {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 10px;
  }

  /* =========================
     FRONT (main face)
  ========================= */

  .front {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    position: relative;
    border-radius: 10px;

    padding: 14px 24px;
    color: white;

    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.8rem;

    transform: translateY(-4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }

  /* =========================
     ACTIVE PRESS EFFECT
  ========================= */

  .pushable:active .front {
    transform: translateY(-1px);
    transition: transform 34ms;
  }

  .pushable:active .shadow {
    transform: translateY(1px);
    transition: transform 34ms;
  }

  /* =========================
     SAVE BUTTON (BLUE)
  ========================= */

  .pushable.save .shadow {
    background: rgba(0, 0, 0, 0.25);
  }

  .pushable.save .edge {
    background: linear-gradient(
        to right,
        hsl(248, 45%, 40%) 0%,
        hsl(248, 45%, 50%) 10%,
        hsl(248, 45%, 40%) 90%,
        hsl(248, 45%, 30%) 100%
    );
  }

  .pushable.save .front {
    background: hsl(248, 53%, 58%);
  }

  /* hover darker purple */
  .pushable.save:hover .front {
    background: hsl(248, 53%, 52%);
  }

  .pushable.save .shadow {
    background: rgba(0, 0, 0, 0.25);
  }

  .pushable.save .edge {
    background: linear-gradient(
        to right,
        #2f5fc2 0%,
        #356dd6 10%,
        #2f5fc2 90%,
        #244d9e 100%
    );
  }

  .pushable.save .front {
    background: #3d78f6;
  }

  .pushable.save:hover .front {
    background: #3269db;
  }

  .pushable.save .shadow {
    background: rgba(0, 0, 0, 0.25);
  }

  .pushable.update .edge {
    background: linear-gradient(
        to right,
        hsl(248, 45%, 40%) 0%,
        hsl(248, 45%, 50%) 10%,
        hsl(248, 45%, 40%) 90%,
        hsl(248, 45%, 30%) 100%
    );
  }

  .pushable.update .front {
    background: hsl(248, 53%, 58%);
  }

  .pushable.update:hover .front {
    background: hsl(248, 53%, 52%);
  }

  .pushable.delete .shadow {
    background: rgba(0, 0, 0, 0.25);
  }

  .pushable.delete .edge {
    background: linear-gradient(
        to right,
        hsl(340, 70%, 40%) 0%,
        hsl(340, 70%, 50%) 10%,
        hsl(340, 70%, 40%) 90%,
        hsl(340, 70%, 30%) 100%
    );
  }

  .pushable.delete .front {
    background: hsl(340, 80%, 60%);
  }

  /* hover darker pink */
  .pushable.delete:hover .front {
    background: hsl(340, 80%, 52%);
  }

  .pushable:disabled {
    cursor: not-allowed;
    filter: grayscale(0.4);
    opacity: 0.7;
  }

  .pushable:disabled .front {
    transform: translateY(-2px) !important;
  }

  .pushable:disabled .shadow {
    transform: translateY(1px) !important;
  }

  .front i {
    font-size: 0.85rem;
    display: inline-flex;
  }

  @media (max-width: 640px) {
    .front {
      padding: 12px 18px;
      font-size: 0.7rem;
    }
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>