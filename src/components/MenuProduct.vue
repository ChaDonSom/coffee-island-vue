<script lang="ts" setup>
import { useMenuPinia, type Product } from "@/stores/menu"
import type { PropType } from "vue"
import { useRoute } from "vue-router/auto"

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
})

const menu = useMenuPinia()
const $route = useRoute()
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 transition-opacity duration-300"
    :class="{ 'opacity-0': $route.meta?.modal && ('id' in $route.params ? $route.params?.id : 0) == product.id }"
  >
    <img
      class="w-32 h-32 object-cover rounded-3xl shadow-xl shadow-gray-400 dark:shadow-gray-900 border-gray-700 border-2"
      :src="product.img"
      data-menu-product="true"
      :data-flip-key="`product-${product.id}`"
    />
    <div class="flex flex-col items-center">
      <span>{{ product.name }}</span>
      <span>{{ menu.asDollars(product.price) }}</span>
    </div>
  </div>
</template>
