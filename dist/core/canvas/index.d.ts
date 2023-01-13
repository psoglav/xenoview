import { Component, VElement } from '..';
import { MarkModel } from '../../models/mark';
export type CanvasOptions = {
    container: HTMLElement;
    components: {
        [name: string]: Component;
    };
    updateByRequest?: boolean;
    zIndex?: number;
};
export declare class Canvas {
    options: CanvasOptions;
    raw: HTMLCanvasElement;
    elements: VElement[];
    needsUpdate: boolean;
    mouse: {
        x: number;
        y: number;
        button: any;
    };
    get canvas(): HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    get width(): number;
    get height(): number;
    get components(): {
        [name: string]: Component;
    };
    constructor(options: CanvasOptions);
    create(): void;
    private createCanvas;
    update(): void;
    add(item: VElement): void;
    remove(item: VElement): void;
    clear(): void;
    fitToParent(): void;
    setSize(w: number, h: number, canvas?: HTMLCanvasElement): void;
    rescale(ctx?: CanvasRenderingContext2D): void;
    getSharpPixel(pos: number, thickness?: number): number;
    getPixelRatio(context: any): number;
    rect(x: number, y: number, w: number, h: number): void;
    circle(x: number, y: number, radius: number): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    line(x1: number, y1: number, x2: number, y2: number, color?: string): void;
    static measureText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, options?: {
        font?: string;
        textAlign?: CanvasTextAlign;
        textBaseline?: CanvasTextBaseline;
    }): Rect;
    drawMark(payload: MarkModel): Rect;
    static isInside(pos: Vector, rect: Rect): boolean;
    getLines(text: string, maxWidth: number, ctx?: CanvasRenderingContext2D): string[];
}
export * from './v-element';
export * from './interactive';
export * from './label';
export * from './button';
export * from './position';
