import { InteractiveVElement, Canvas, Label } from '.';
export class Button extends InteractiveVElement {
    constructor(canvas, x, y, options) {
        super(canvas);
        this.options = options;
        if (options.padding)
            this.setPadding(options.padding.x, options.padding.y);
        this.setPosition(x, y);
        this.label = new Label(canvas, x, y, options.text);
    }
    update() {
        if (this.isGrabbed) {
            this.options.grab && this.options.grab(this);
        }
        this.rect = Canvas.measureText(this.ctx, this.options.text, this.position.x, this.position.y);
        this.draw();
        this.label.setPosition(this.position.x, this.position.y);
        this.label.color = this.options.textColor[this.state] || this.options.textColor.default;
        this.label.update();
    }
    draw() {
        const { x, y, width, height } = this.rect;
        if (this.options.border) {
            this.ctx.lineWidth = this.options.border.width;
            this.ctx.strokeStyle = this.options.border.color;
            this.ctx.strokeRect(x, y, width, height);
        }
        this.ctx.clearRect(x, y, width, height);
        this.ctx.fillStyle = this.chart._opts.bgColor;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.fillStyle = this.options.fillColor[this.state];
        this.ctx.fillRect(x, y, width, height);
    }
    onMouseDown(e) { }
    onMouseUp(e) {
        this.options.click && this.options.click(this);
    }
    onMouseEnter(e) { }
    onMouseMove(e) { }
    onMouseLeave(e) { }
}
