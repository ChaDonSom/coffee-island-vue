<script lang="ts" setup>
import { useMenuPinia, type Product } from "@/stores/menu"
import type { PropType } from "vue"

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
})
</script>

<template>
  <img
    class="w-8 h-8 object-cover rounded-3xl shadow shadow-gray-400 dark:shadow-gray-900 border-gray-700 border"
    :src="product.img"
  />
</template>
