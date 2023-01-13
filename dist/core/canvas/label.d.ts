import { VElement } from './v-element';
export declare class Label extends VElement {
    text: string;
    color: string;
    align: CanvasTextAlign;
    baseline: CanvasTextBaseline;
    constructor(canvas: HTMLCanvasElement, x: number, y: number, text: string, color?: string, align?: CanvasTextAlign, baseline?: CanvasTextBaseline);
    update(): void;
    draw(): void;
    destroy(): void;
    onMouseDown(e: MouseEvent): void;
    onMouseEnter(e: MouseEvent): void;
    onMouseLeave(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
}
