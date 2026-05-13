<template>
  <div class="fixed top-4 right-4 space-y-2 z-[9999] pointer-events-none">
    <div
        v-for="t in toasts"
        :key="t.id"
        class="px-4 py-2 rounded shadow-lg text-white text-sm pointer-events-auto"
        :class="{
          'bg-green-500': t.type === 'success',
          'bg-red-500': t.type === 'error',
          'bg-blue-500': t.type === 'info'
        }"
    >
      {{ t.message }}
    </div>
  </div>
</template>

<script setup>
    import { useToast } from "../composables/useToast";

    const { toasts } = useToast();
</script>