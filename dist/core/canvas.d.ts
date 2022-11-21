import { Component } from '.';
export declare type CanvasOptions = {
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
    needsUpdate: boolean;
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
}
