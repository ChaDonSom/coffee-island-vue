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
  <tr>
    <td>
      <button
        class="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center"
        @click="menu.cart.splice(menu.cart.indexOf(product.id), 1)"
      >X</button>
    </td>
    <td class="p-2">
      <img
        class="w-14 h-14 object-cover rounded-2xl shadow-md shadow-gray-400 dark:shadow-gray-900 border-gray-700 border"
        :src="product.img"
      />
    </td>
    <td class="p-2"><span>{{ product.name }}</span></td>
    <td class="p-2 text-right"><span>{{ menu.asDollars(product.price) }}</span></td>
  </tr>
</template>
