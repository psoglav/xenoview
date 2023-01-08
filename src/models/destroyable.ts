export default interface Destroyable {
  bind(): void
  onMouseMove(e: MouseEvent): void
  onMouseDown(e: MouseEvent): void
  onMouseUp(e: MouseEvent): void
  destroy(): void
}