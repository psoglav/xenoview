export interface MarksRendererData {
    items: string[];
    align: 'vertical' | 'horizontal';
}
export default class MarksRenderer {
    private _items;
    constructor(data: MarksRendererData);
    draw(ctx: CanvasRenderingContext2D): void;
    drawMark(ctx: CanvasRenderingContext2D): void;
}
