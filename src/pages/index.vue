<script lang="ts" setup>
import MenuProduct from "@/components/MenuProduct.vue"
import MenuProductThumbnail from "@/components/MenuProductThumbnail.vue"
import { useMenuPinia, type Product, productCardFlipTransitionFirst } from "@/stores/menu"
import { onMounted, ref, watch } from "vue"
// @ts-ignore
import autoAnimate from "@formkit/auto-animate"
import { RouterLink, useRouter } from "vue-router/auto"
import { useRoute } from "vue-router/auto"

const menu = useMenuPinia()
const mainRef = ref<HTMLElement | null>(null)

onMounted(() => autoAnimate(mainRef.value))

const $router = useRouter()
function openProductModal(product: Product) {
  menu.flipping.read()
  $router.push('/' + product.id)
}

const showModal = ref(false)
const $route = useRoute()
watch(() => $route, value => showModal.value = !!value.meta?.modal, { immediate: true, deep: true })
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
      <MenuProduct v-for="product of menu.products" :product="product" @click="openProductModal(product)" />
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="modal-route" @click="$router.go(-1)">
          <div class="modal-content">
            <RouterView />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.modal-route {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba($color: #5a5a5a, $alpha: 0.5);
  .modal-content {
    width: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>