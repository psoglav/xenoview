export default class UI {
    ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D);
    changeContext(ctx: CanvasRenderingContext2D): void;
    label(text: string, x: number, y: number, size: number): void;
}
