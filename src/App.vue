<template>
  <div class="h-full flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

    <div class="flex-1 overflow-hidden">
      <router-view />
    </div>

    <ToastContainer />

  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import ToastContainer from './components/ToastContainer.vue'

    const dark = ref(false)

    const toggle = () => {
        dark.value = !dark.value
        document.documentElement.classList.toggle('dark', dark.value)
    }
</script>