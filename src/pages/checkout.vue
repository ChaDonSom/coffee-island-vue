<script lang="ts" setup>
import CheckoutProduct from "@/components/CheckoutProduct.vue"
import { useMenuPinia } from "@/stores/menu"
import { computed } from "vue"
import { useRouter } from "vue-router/auto"

const menu = useMenuPinia()

const $router = useRouter()

const left = computed(() => menu.purseTotal - menu.cartTotalNumber)
function purchaseAndReturn() {
  if (menu.purseTotal < menu.cartTotalNumber) {
    alert("You don't have enough money!")
    return
  }
  menu.purseTotal -= menu.cartTotalNumber
  menu.cart = []
  $router.push("/")
}
</script>

<template>
  <div>
    <h1 class="text-3xl">Checkout</h1>
    <table>
      <CheckoutProduct v-for="productId of menu.cart" :product="menu.productsData[productId]" />
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="text-right">
          <h1 class="text-3xl">You have: {{ menu.asDollars(menu.purseTotal) }}</h1>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td class="text-right">
          <h1 class="text-3xl">Total: {{ menu.cartTotal }}</h1>
        </td>
      </tr>
      <tr v-if="left > 0">
        <td></td>
        <td></td>
        <td></td>
        <td class="text-right">
          <h1 class="text-3xl">{{ menu.asDollars(left) }}</h1>
        </td>
      </tr>
    </table>
    <button
      class="py-5 px-10 rounded-[2.5rem] bg-orange-900 text-white hover:bg-orange-800 transition-colors"
      @click="purchaseAndReturn"
    >
      Purchase
    </button>
  </div>
</template>
