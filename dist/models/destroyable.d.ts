export default interface Destroyable {
    isDestroyed: boolean;
    onMouseMove(e: MouseEvent): void;
    onMouseDown(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    destroy(): void;
}
