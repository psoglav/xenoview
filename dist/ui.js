"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = exports.UIElementGroup = exports.UIElement = exports.UI = void 0;
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
    constructor(opts) {
        this.position = { x: opts.x, y: opts.y };
        this.ctx = opts.ctx;
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
exports.UIElement = UIElement;
class UIElementGroup extends UIElement {
    constructor(opts) {
        super({ x: opts.x, y: opts.y, ctx: opts.ctx });
        this.position = { x: opts.x, y: opts.y };
        this.elements = opts.elements;
        this.gap = opts.gap;
    }
    get width() {
        let result = 0;
        this.elements.forEach(el => {
            if (typeof el == 'number')
                result += el;
            else
                result += el.width + this.gap;
        });
        return result;
    }
    draw() {
        let xcur = this.position.x;
        this.elements.forEach(el => {
            if (typeof el == 'number') {
                xcur += el;
                return;
            }
            el.position.x = xcur;
            el.draw();
            xcur += el.width + this.gap;
        });
    }
}
exports.UIElementGroup = UIElementGroup;
class Label extends UIElement {
    constructor(opts) {
        super({ x: opts.x, y: opts.y, ctx: opts.ctx });
        this.value = opts.value;
        this.font = opts.font;
        this.size = opts.size;
        this.color = opts.color;
    }
    get text() {
        let result = this.value;
        if (typeof this.value == 'object') {
            result = this.value[0][this.value[1]];
        }
        else if (typeof this.value == 'function') {
            result = this.value();
        }
        return result.toString();
    }
    setStyle() {
        this.ctx.fillStyle = typeof this.color == 'function' ? this.color() : this.color;
        this.ctx.font = this.size + 'px ' + this.font;
    }
    get width() {
        this.setStyle();
        return this.ctx.measureText(this.text).width;
    }
    draw() {
        this.setStyle();
        this.ctx.fillText(this.text, this.position.x, this.position.y);
    }
}
exports.Label = Label;
//# sourceMappingURL=ui.js.map