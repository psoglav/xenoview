"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = exports.UIElement = exports.UI = void 0;
class UI {
    constructor(...elements) {
        this.elements = elements;
    }
    draw(clear) {
        if (clear) {
            for (let el of this.elements) {
                el.clearCanvas();
            }
        }
        for (let el of this.elements) {
            el.draw();
        }
    }
}
exports.UI = UI;
class UIElement {
    constructor(x, y, ctx) {
        this.position = [x, y];
        this.ctx = ctx;
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
exports.UIElement = UIElement;
class Label extends UIElement {
    constructor(opts) {
        super(opts.x, opts.y, opts.ctx);
        this.value = opts.value;
        this.font = opts.font;
        this.size = opts.size;
        this.color = opts.color;
    }
    get text() {
        let result = '';
        if (typeof this.value != 'string') {
            if (typeof this.value == 'object') {
                result = this.value[0][this.value[1]];
            }
            else if (typeof this.value == 'function') {
                result = this.value();
            }
        }
        else {
            result = this.value;
        }
        return result;
    }
    get width() {
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.size + 'px ' + this.font;
        return this.ctx.measureText(this.text).width;
    }
    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.size + 'px ' + this.font;
        this.ctx.fillText(this.text, this.position[0], this.position[1]);
    }
}
exports.Label = Label;
//# sourceMappingURL=ui.js.map