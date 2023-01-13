import { VElement } from './v-element';
type MouseCursorState = 'hover' | 'active' | 'default';
export declare abstract class InteractiveVElement extends VElement {
    mouse: Vector;
    get isFocused(): boolean;
    private _listeners;
    private _state;
    get state(): MouseCursorState;
    set state(value: MouseCursorState);
    get isHovered(): boolean;
    get isClicked(): boolean;
    isGrabbed: boolean;
    constructor(canvas: HTMLCanvasElement);
    bind(): void;
    private _onMouseLeave;
    private _onMouseMove;
    private _onMouseDown;
    private _onMouseUp;
    destroy(): void;
}
export {};
