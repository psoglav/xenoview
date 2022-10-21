"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
class Canvas {
    constructor(options) {
        this.needsUpdate = true;
        this.options = options;
        this.create();
    }
    get canvas() {
        return this.raw;
    }
    get ctx() {
        return this.canvas.getContext('2d');
    }
    get width() {
        return this.raw.width;
    }
    get height() {
        return this.raw.height;
    }
    get components() {
        return this.options.components;
    }
    create() {
        this.raw = this.createCanvas();
    }
    createCanvas() {
        const preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        let el = document.createElement('canvas');
        let ctx = el.getContext('2d');
        ctx.lineWidth = 1 * this.getPixelRatio(ctx);
        el.oncontextmenu = preventDefault;
        el.onwheel = preventDefault;
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.position = 'absolute';
        el.style.inset = '0';
        el.style.zIndex = (this.options.zIndex || 0).toString();
        let rect = this.options.container.getBoundingClientRect();
        this.setSize(rect.width, rect.height, el);
        this.options.container.appendChild(el);
        this.rescale(ctx);
        return el;
    }
    update() {
        if (!this.options.updateByRequest || this.needsUpdate) {
            this.rescale();
            this.clear();
            Object.entries(this.options.components).forEach(([key, component]) => {
                component.update(this);
            });
            this.needsUpdate = false;
        }
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    fitToParent() {
        const rect = this.raw.parentElement.getBoundingClientRect();
        this.setSize(rect.width, rect.height);
    }
    setSize(w, h, canvas) {
        if (!canvas)
            canvas = this.raw;
        canvas.width = w;
        canvas.height = h;
    }
    rescale(ctx) {
        let _ctx = ctx || this.ctx;
        let pixelRatio = this.getPixelRatio(_ctx);
        let width = _ctx.canvas.clientWidth * pixelRatio;
        let height = _ctx.canvas.clientHeight * pixelRatio;
        if (width != _ctx.canvas.width)
            _ctx.canvas.width = width;
        if (height != _ctx.canvas.height)
            _ctx.canvas.height = height;
        _ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }
    getSharpPixel(pos, thickness = 1) {
        if (thickness % 2 == 0) {
            return pos;
        }
        return pos + this.getPixelRatio(this.ctx) / 2;
    }
    getPixelRatio(context) {
        let dpr = window.devicePixelRatio || 1;
        let bsr = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1;
        return dpr / bsr;
    }
}
exports.Canvas = Canvas;
//# sourceMappingURL=canvas.js.map