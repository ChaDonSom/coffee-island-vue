<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router/auto"
import { type Product, productCardFlipTransitionFirst, productCardFlipTransitionLast, useMenuPinia } from "../../stores/menu"
import { computed, onMounted, ref } from "vue"

const menu = useMenuPinia()
const $route = useRoute()
const product = computed<Product>(() => menu.productsData[Number('id' in $route.params ? $route.params?.id : '')])

const $router = useRouter()
function addToCartAndReturn() {
  menu.cart.push(product.value.id)
  $router.go(-1)
}

const imgRef = ref<HTMLImageElement>()
onMounted(() => {
  productCardFlipTransitionLast.value = imgRef.value?.getBoundingClientRect() ?? null
  let first = productCardFlipTransitionFirst.value
  let last = productCardFlipTransitionLast.value

  if (!first || !last || !imgRef.value) return
  const deltaX = first.left - last.left
  const deltaY = first.top - last.top
  const deltaW = first.width / last.width
  const deltaH = first.height / last.height

  const overallDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2)

  imgRef.value.animate(
    [
      {
        opacity: 0,
        transformOrigin: "top left",
        transform: `
          translate(${deltaX}px, ${deltaY}px)
          scale(${deltaW}, ${deltaH})
        `,
      },
      {
        opacity: 1,
        transformOrigin: "top left",
        transform: "none",
      },
    ],
    {
      duration: overallDistance * .6,
      easing: "ease-out",
      fill: "both",
    }
  )
})
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <img
      ref="imgRef"
      class="object-cover rounded-3xl shadow-xl shadow-gray-400 dark:shadow-gray-900 border-gray-700 border-2 max-w-3xl max-h-80"
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
