<script lang="ts" setup>
import { useRoute, useRouter, definePage } from "vue-router/auto"
import { type Product, useMenuPinia } from "../../stores/menu"
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { useMenuProductDragToDismiss } from "@/composables/menu-product-drag-to-dismiss"

definePage({
  meta: {
    modal: true,
  },
})

const menu = useMenuPinia()
const $route = useRoute()
const product = computed<Product>(() => menu.productsData[Number("id" in $route.params ? $route.params?.id : "")])

const $router = useRouter()
function addToCartAndReturn() {
  menu.cart.push(product.value.id)
  $router.go(-1)
}

const imgRef = ref<HTMLImageElement|null>(null)
onMounted(() => menu.flipping.flip())
useMenuProductDragToDismiss(imgRef, product)

onMounted(() => (document.body.style.overflow = "hidden"))
onBeforeUnmount(() => (document.body.style.overflow = "unset"))
</script>

<template>
  <div class="flex flex-col items-center gap-3 bg-transparent">
    <img
      ref="imgRef"
      class="object-cover rounded-3xl shadow-xl shadow-gray-400 dark:shadow-gray-900 border-gray-700 border-2 max-w-3xl max-h-80"
      :data-flip-key="`product-${product.id}`"
      data-menu-product-modal="true"
      :src="product.img"
    />
    <div class="flex flex-col items-center">
      <span>{{ product.name }}</span>
      <span>{{ menu.asDollars(product.price) }}</span>
    </div>
    <button
      class="py-3 px-6 rounded-[2.5rem] bg-gray-200 hover:bg-gray-100 transition-colors dark:text-gray-900"
      @click="$router.go(-1)"
    >
      Back
    </button>
    <button
      class="py-5 px-10 rounded-[2.5rem] bg-orange-900 text-white hover:bg-orange-800 transition-colors"
      @click="addToCartAndReturn"
    >
      Add to cart
    </button>
  </div>
</template>
