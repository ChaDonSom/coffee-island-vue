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
    if (!el.value) return
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
    if (y0 === undefined) return
    const y1 = e instanceof MouseEvent ? e.clientY : e.changedTouches[0].clientY
    document.removeEventListener("mousemove", drag, false)
    target?.removeEventListener("touchmove", drag, false)
    document.removeEventListener("mouseup", finishDrag, false)
    target?.removeEventListener("touchend", finishDrag, false)
    if (target) target.style.transform = ""
    let { newX, newY, newW, newH } = getNewValues()
    let { newY: mouseNewY } = getNewValuesPerMousePosition(y1, y0)

    const draggedRatio = mouseNewY / newY

    y0 = undefined
    // If the drag was more than halfway to the endpoints, dismiss the product
    if (draggedRatio > 0.2) {
      wasDraggedToDismiss.value = true
      const speed = 0.4 * draggedRatio
      if (target) target.style.transition = `transform ${speed}s ease-in-out`
      if (target) target.style.transform = `translate(${newX}px, ${newY}px) scale(${newW}, ${newH})`
      setTimeout(() => {
        watch(() => $route, () => setTimeout(() => wasDraggedToDismiss.value = false, 200), { deep: true })
        $router.go(-1)
      }, 200)
    }
  }

  return { wasDraggedToDismiss }
}

let y0: number|undefined = undefined
let flipTo: DOMRect|undefined = undefined
let flipFrom: DOMRect|undefined = undefined

function drag(e: MouseEvent | TouchEvent) {
  if (!y0) return
  if (y0 < 0) return
  const y1 = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY

  const { newY: originalNewY } = getNewValues()
  const { newX, newY, newW, newH } = getNewValuesPerMousePosition(y1, y0)
  if (newY / originalNewY > 1 || newY / originalNewY < 0) return

  if (target) target.style.transform = `translate(${newX}px, ${newY}px) scale(${newW}, ${newH})`
  if (target) target.style.transformOrigin = `top left`
}

function getNewValues() {
  if (!flipTo || !flipFrom) return { newX: 0, newY: 0, newW: 1, newH: 1 }
  const newX = flipTo.left - flipFrom.left
  const newY = flipTo.top - flipFrom.top
  const newW = flipTo.width / flipFrom.width
  const newH = flipTo.height / flipFrom.height
  return { newX, newY, newW, newH }
}

function getNewValuesPerMousePosition(y1: number, y0: number) {
  const { newX: originalNewX, newY: originalNewY, newW: originalNewW, newH: originalNewH } = getNewValues()

  // newW and newH need to be modified so that at f = 1, newW and newH reach newW and newH, and at y1 = y0, newW and newH reach 1
  const newW = 1 + ((originalNewW - 1) * (y1 - y0)) / 500
  const newH = 1 + ((originalNewH - 1) * (y1 - y0)) / 500

  // newX and newY need to be modified so that they're at 0 when y1 = y0, and at newX and newY when y1 = bottomOfScreen
  const newX = (originalNewX * (y1 - y0)) / 500
  const newY = (originalNewY * (y1 - y0)) / 500

  return { newX, newY, newW, newH }
}
