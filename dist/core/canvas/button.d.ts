import { InteractiveVElement } from '.';
export interface ButtonOptions {
    text: string;
    padding?: {
        x: number;
        y: number;
    };
    border?: {
        width: number;
        color: string;
    };
    textColor: {
        default: string;
        hover?: string;
        active?: string;
    };
    fillColor: {
        default: string;
        hover?: string;
        active?: string;
    };
    click?(ctx: Button): void;
    grab?(ctx: Button): void;
}
export declare class Button extends InteractiveVElement {
    options: ButtonOptions;
    private label;
    constructor(canvas: HTMLCanvasElement, x: number, y: number, options: ButtonOptions);
    update(): void;
    draw(): void;
    onMouseDown(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onMouseEnter(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onMouseLeave(e: MouseEvent): void;
}
