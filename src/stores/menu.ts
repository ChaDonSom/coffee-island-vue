import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useStorage } from "@vueuse/core"
import Flipping from "flipping/dist/flipping.web.js"

const randomCoffeeNames = [
  "Cappuccino",
  "Espresso",
  "Latte",
  "Mocha",
  "Americano",
  "Macchiato",
  "Cortado",
  "Flat White",
  "Affogato",
  "Irish Coffee",
  "Café au Lait",
  "Café Bombón",
  "Café Cubano",
  "Café con Hielo",
  "Café de Olla",
  "Café del Tiempo",
  "Decaf",
  "Mocha",
  "Café con Leche",
  "Café con Panna",
]

export type Product = { id: number; name: string; img: string; price: number }
function useMenu() {
  const totalProducts = ref(30)
  const productsData = useStorage<Record<number, Product>>("coffee-island-products-data", {})
  const products = computed({
    get: () => Object.values(productsData.value),
    set: (value: Product[]) => {
      productsData.value = value.reduce((acc, product) => {
        acc[product.id] = product
        return acc
      }, {} as Record<number, Product>)
    },
  })
  products.value = Array.from({ length: totalProducts.value }, (_, i) => ({
    id: i + 1,
    name: randomCoffeeNames[Math.floor(Math.random() * randomCoffeeNames.length)],
    price: Math.floor(Math.random() * 1000) / 100,
    img: `https://coffee.alexflipnote.dev/random?i=${i + 1}`,
  }))

  const asDollars = (price: number) => `$${(Math.round(price * 100) / 100).toFixed(2)}`
  const cart = useStorage<number[]>("coffee-island-cart", [])
  const cartTotalNumber = computed(() => cart.value.reduce((acc, id) => acc + productsData.value[id].price, 0))
  const cartTotal = computed(() => asDollars(cartTotalNumber.value))

  const purseTotal = useStorage<number>("coffee-island-purse", 100)
  purseTotal.value = 100

  const flipping = new Flipping()

  return {
    totalProducts,
    products,
    productsData,
    cart,
    cartTotal,
    asDollars,
    purseTotal,
    cartTotalNumber,
    flipping,
  }
}

export const useMenuPinia = defineStore("menu", useMenu)
