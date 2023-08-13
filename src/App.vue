<script setup lang="ts">
import { RouterView } from "vue-router"
</script>

<template>
  <RouterView #="{ Component }">
    <Transition name="fade" mode="out-in">
      <Component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
