export declare class UI {
    elements: UIElement[];
    constructor(...elements: UIElement[]);
    draw(clear?: boolean): void;
}
export declare abstract class UIElement {
    position: [number, number];
    ctx: CanvasRenderingContext2D;
    constructor(x: number, y: number, ctx: CanvasRenderingContext2D);
    abstract draw(): void;
    clearCanvas(): void;
}
declare type UIElementValue = string | [object, string] | Function;
declare type UILabelOptions = {
    value: UIElementValue;
    x: number;
    y: number;
    font: string;
    size: number;
    color: string;
    ctx: CanvasRenderingContext2D;
};
export declare class Label extends UIElement {
    value: UIElementValue;
    font: string;
    size: number;
    color: string;
    constructor(opts: UILabelOptions);
    get text(): string;
    get width(): number;
    draw(): void;
}
export {};
