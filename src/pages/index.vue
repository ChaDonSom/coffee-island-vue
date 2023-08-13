<script lang="ts" setup>
import MenuProduct from "@/components/MenuProduct.vue"
import MenuProductThumbnail from "@/components/MenuProductThumbnail.vue"
import { useMenuPinia, type Product, productCardFlipTransitionFirst } from "@/stores/menu"
import { onMounted, ref } from "vue"
import autoAnimate from "@formkit/auto-animate"
import { RouterLink, useRouter } from "vue-router/auto"

const menu = useMenuPinia()
const mainRef = ref<HTMLElement | null>(null)

onMounted(() => autoAnimate(mainRef.value))

const $router = useRouter()
function storeThumbnailPosition(event: MouseEvent, product: Product) {
  productCardFlipTransitionFirst.value = (event.currentTarget as HTMLElement)?.getBoundingClientRect()
  $router.push('/products/' + product.id)
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 justify-end mb-3">
      <span class="mr-auto">You have: {{ menu.asDollars(menu.purseTotal) }}</span>
      <span>Cart: {{ menu.cartTotal }}</span>
      <div
        class="my-5 flex flex-wrap gap-2 items-center justify-end"
      >
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
      <MenuProduct v-for="product of menu.products" :product="product" @click="storeThumbnailPosition($event, product)" />
    </div>
  </div>
</template>
