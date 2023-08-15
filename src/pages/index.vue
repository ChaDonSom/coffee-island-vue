<script lang="ts" setup>
import MenuProduct from "@/components/MenuProduct.vue"
import MenuProductThumbnail from "@/components/MenuProductThumbnail.vue"
import { useMenuPinia, type Product } from "@/stores/menu"
import { onMounted, ref, watch } from "vue"
// @ts-ignore
import autoAnimate from "@formkit/auto-animate"
import { RouterLink, useRouter } from "vue-router/auto"
import { useRoute } from "vue-router/auto"
import { wasDraggedToDismiss } from "@/composables/menu-product-drag-to-dismiss"
import getTransformForFlip from "@/composables/useFlip"

const menu = useMenuPinia()
const mainRef = ref<HTMLElement | null>(null)

onMounted(() => autoAnimate(mainRef.value))

const $router = useRouter()
function openProductModal(product: Product) {
  menu.flipping.read()
  $router.push("/" + product.id)
}

const showModal = ref(false)
const $route = useRoute()
watch(
  () => $route,
  (value) => (showModal.value = !!value.meta?.modal),
  { immediate: true, deep: true }
)

const goBackWithAnimation = () => {
  const first = document.querySelector("[data-menu-product-modal]") as HTMLElement
  const firstBounding = first.getBoundingClientRect()
  const query = `[data-flip-key="${first.dataset.flipKey}"]:not([data-menu-product-modal])`
  const last = document.querySelector(query) as HTMLElement
  const lastBounding = last.getBoundingClientRect()
  $router.back()
  const transform = getTransformForFlip(firstBounding, lastBounding)
  last.animate([{ transform: transform, transformOrigin: "top left" }, { transform: "unset" }], {
    duration: 400,
    easing: "cubic-bezier(0.7, 0, 0.3, 1)",
  })
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 justify-end mb-3">
      <span class="mr-auto">You have: {{ menu.asDollars(menu.purseTotal) }}</span>
      <span>Cart: {{ menu.cartTotal }}</span>
      <div class="my-5 flex flex-wrap gap-2 items-center justify-end">
        <MenuProductThumbnail v-for="productId of menu.cart" :product="menu.productsData[productId]" />
      </div>
      <RouterLink
        to="/checkout"
        class="py-5 px-10 rounded-[2.5rem] bg-orange-900 text-white hover:bg-orange-800 transition-colors"
      >
        Checkout
      </RouterLink>
    </div>
    <div class="grid gap-7 grid-cols-3 md:grid-cols-5 lg:grid-cols-7" ref="mainRef">
      <MenuProduct v-for="product of menu.products" :product="product" @click="openProductModal(product)" />
    </div>

    <Teleport to="body">
      <Transition name="fade-zoom">
        <div
          v-if="showModal"
          class="w-full h-full fixed top-0 left-0 bg-zinc-300/90 dark:bg-zinc-700/90"
          @click="goBackWithAnimation"
        >
          <div class="modal-content w-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <RouterView :goBackWithAnimation="goBackWithAnimation" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: opacity 0.18s ease;
  .modal-content {
    transition: transform 0.18s ease;
  }
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  .modal-content {
    transform: translate(-50%, -50%) scale(0.9);
  }
}
</style>
