import { VElement } from './v-element';
import { Canvas } from '.';
export class Label extends VElement {
    constructor(canvas, x, y, text, color, align, baseline) {
        super(canvas);
        this.setPosition(x, y);
        this.text = text;
        this.color = color;
        this.align = align;
        this.baseline = baseline;
    }
    update() {
        this.draw();
    }
    draw() {
        this.rect = Canvas.measureText(this.ctx, this.text, this.position.x, this.position.y);
        if (this.color)
            this.ctx.fillStyle = this.color;
        if (this.align)
            this.ctx.textAlign = this.align;
        if (this.baseline)
            this.ctx.textBaseline = this.baseline;
        this.ctx.fillText(this.text, this.position.x, this.position.y);
    }
    destroy() { }
    onMouseDown(e) { }
    onMouseEnter(e) { }
    onMouseLeave(e) { }
    onMouseMove(e) { }
    onMouseUp(e) { }
}
