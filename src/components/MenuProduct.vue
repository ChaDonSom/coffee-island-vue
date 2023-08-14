<script lang="ts" setup>
import { useMenuPinia, type Product } from "@/stores/menu"
import type { PropType } from "vue"

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
})

const menu = useMenuPinia()
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <img
      class="w-32 h-32 object-cover rounded-3xl shadow-xl shadow-gray-400 dark:shadow-gray-900 border-gray-700 border-2"
      :src="product.img"
      :data-flip-key="`product-${product.id}`"
    />
    <div class="flex flex-col items-center">
      <span>{{ product.name }}</span>
      <span>{{ menu.asDollars(product.price) }}</span>
    </div>
  </div>
</template>
