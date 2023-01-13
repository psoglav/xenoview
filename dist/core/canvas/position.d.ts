import { VElement } from '.';
export declare class Position extends VElement {
    options: OrderModel;
    get color(): any;
    get fillColor(): any;
    private buttonGroup;
    constructor(canvas: HTMLCanvasElement, options: OrderModel);
    update(): void;
    draw(): void;
    onMouseDown(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onMouseEnter(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseLeave(e: MouseEvent): void;
    destroy(): void;
}
