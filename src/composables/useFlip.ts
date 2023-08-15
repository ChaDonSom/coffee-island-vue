export default function getTransformForFlip(bounding1: DOMRect, bounding2: DOMRect) {
  const scaleX = bounding1.width / bounding2.width;
  const scaleY = bounding1.height / bounding2.height;
  const translateX = bounding1.left - bounding2.left;
  const translateY = bounding1.top - bounding2.top;
  return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
}