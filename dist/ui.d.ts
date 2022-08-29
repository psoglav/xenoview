export declare class UI {
    elements: UIElement[];
    constructor(...elements: UIElement[]);
    draw(clear?: boolean): void;
}
export declare abstract class UIElement {
    position: UI.Position;
    ctx: CanvasRenderingContext2D;
    constructor(opts: UI.ElementOptions);
    abstract draw(): void;
    abstract width: number;
    clearCanvas(): void;
}
export declare class UIElementGroup extends UIElement {
    position: UI.Position;
    elements: UIElement[];
    gap: number;
    constructor(opts: UI.ElementGroupOptions);
    get width(): number;
    draw(): void;
}
export declare class Label extends UIElement {
    value: any;
    font: string;
    size: number;
    color: string;
    constructor(opts: UI.LabelOptions);
    get text(): string;
    get width(): number;
    draw(): void;
}
