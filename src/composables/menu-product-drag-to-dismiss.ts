import { Product } from "@/stores/menu"
import { Ref, onMounted, watch, ref } from "vue"
import { useRoute } from "vue-router/auto"
import { useRouter } from "vue-router/auto"

let target: HTMLElement | null = null
export const wasDraggedToDismiss = ref(false)
export function useMenuProductDragToDismiss(el: Ref<HTMLElement | null>, product: Ref<Product | null>) {
  onMounted(() => {
    if (!el.value) return
    el.value.addEventListener("mousedown", lock, false)
    el.value.addEventListener("touchstart", lock, false)
  })

  function lock(e: MouseEvent | TouchEvent) {
    if (!e.target) return
    target = e.target as HTMLElement
    y0 = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
    let flips = document.querySelectorAll(`[data-flip-key="product-${product.value?.id}"]`)
    flipTo = [...flips].filter((f) => f !== el.value)[0].getBoundingClientRect()
    flipFrom = el.value.getBoundingClientRect()
    document.addEventListener("mousemove", drag, false)
    target.addEventListener("touchmove", drag, false)
    document.addEventListener("mouseup", finishDrag, false)
    target.addEventListener("touchend", finishDrag, false)
  }

  const $router = useRouter()
  const $route = useRoute()
  function finishDrag(e: MouseEvent | TouchEvent) {
    if (!y0) return
    const y1 = e instanceof MouseEvent ? e.clientY : e.changedTouches[0].clientY
    const deltaY = y1 - y0
    document.removeEventListener("mousemove", drag, false)
    target.removeEventListener("touchmove", drag, false)
    document.removeEventListener("mouseup", finishDrag, false)
    target.removeEventListener("touchend", finishDrag, false)
    target.style.transform = ""
    y0 = undefined
    if (deltaY > 100) {
      wasDraggedToDismiss.value = true
      let { newX, newY, newW, newH } = getNewValues()
      target.style.transition = "transform 0.2s ease-in-out"
      target.style.transform = `translate(${newX}px, ${newY}px) scale(${newW}, ${newH})`
      setTimeout(() => {
        watch(() => $route, () => setTimeout(() => wasDraggedToDismiss.value = false, 200), { deep: true })
        $router.go(-1)
      }, 200)
    }
  }

  return { wasDraggedToDismiss }
}

let y0 = undefined
let flipTo = undefined
let flipFrom = undefined

function drag(e: MouseEvent | TouchEvent) {
  if (!y0) return
  if (y0 < 0) return
  const y1 = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY
  const bottomOfScreen = window.innerHeight
  const f = y1 / bottomOfScreen

  let { newX, newY, newW, newH } = getNewValues()

  // newW and newH need to be modified so that at f = 1, newW and newH reach newW and newH, and at f = 0, newW and newH reach 1
  newW = (newW - 1) * f + 1
  newH = (newH - 1) * f + 1

  target.style.transform = `translate(${newX * f}px, ${newY * f}px) scale(${newW}, ${newH})`
  target.style.transformOrigin = `top left`
}

function getNewValues() {
  const newX = flipTo.left - flipFrom.left
  const newY = flipTo.top - flipFrom.top
  const newW = flipTo.width / flipFrom.width
  const newH = flipTo.height / flipFrom.height
  return { newX, newY, newW, newH }
}
