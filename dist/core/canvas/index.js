export class Canvas {
    get canvas() {
        return this.raw;
    }
    get ctx() {
        return this.canvas.getContext('2d');
    }
    get width() {
        return this.raw.width * this.getPixelRatio(this.ctx);
    }
    get height() {
        return this.raw.height * this.getPixelRatio(this.ctx);
    }
    get components() {
        return this.options.components;
    }
    constructor(options) {
        this.elements = [];
        this.needsUpdate = true;
        this.mouse = { x: 0, y: 0, button: null };
        this.options = options;
        this.create();
    }
    create() {
        this.raw = this.createCanvas();
        const canvasRect = this.raw.getBoundingClientRect();
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX - canvasRect.x;
            this.mouse.y = e.clientY - canvasRect.y;
        });
        window.addEventListener('mousedown', (e) => {
            this.mouse.button = e.button;
        });
        window.addEventListener('mouseup', (e) => {
            this.mouse.button = null;
        });
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
        this.elements = this.elements.filter(el => !el.isDestroyed);
        this.elements.forEach(el => {
            el.update();
        });
    }
    add(item) {
        this.elements.push(item);
    }
    remove(item) {
        this.elements = this.elements.filter(el => el !== item);
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
    rect(x, y, w, h) {
        this.ctx.rect(this.getSharpPixel(Math.round(x) + 0.5), this.getSharpPixel(Math.round(y) + 0.5), this.getSharpPixel(Math.round(w) + 0.5), this.getSharpPixel(Math.round(h) + 0.5));
    }
    circle(x, y, radius) {
        this.ctx.beginPath();
        x = this.getSharpPixel(Math.round(x) + 0.5);
        y = this.getSharpPixel(Math.round(y) + 0.5);
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }
    moveTo(x, y) {
        this.ctx.moveTo(this.getSharpPixel(Math.round(x)), this.getSharpPixel(Math.round(y)));
    }
    lineTo(x, y) {
        this.ctx.lineTo(this.getSharpPixel(Math.round(x)), this.getSharpPixel(Math.round(y)));
    }
    line(x1, y1, x2, y2, color) {
        if (color)
            this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    static measureText(ctx, text, x, y, options = {}) {
        ctx.font = options.font || '11px Verdana';
        ctx.textAlign = options.textAlign || 'left';
        ctx.textBaseline = options.textBaseline || 'middle';
        const metrics = ctx.measureText(text);
        const width = metrics.width;
        const height = metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxAscent;
        if (ctx.textAlign == 'center') {
            x -= width / 2;
        }
        else if (['right', 'end'].includes(ctx.textAlign)) {
            x -= width;
        }
        if (ctx.textBaseline == 'middle') {
            y -= height / 2;
        }
        else if (['bottom'].includes(ctx.textBaseline)) {
            y -= height;
        }
        return {
            x,
            y,
            width,
            height
        };
    }
    drawMark(payload) {
        const ctx = this.ctx;
        ctx.font = '11px Verdana';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const metrics = ctx.measureText(payload.text);
        const tw = metrics.width;
        const th = metrics.fontBoundingBoxDescent + metrics.fontBoundingBoxAscent;
        let px = 6;
        let py = 3;
        const calculateRect = () => ({
            x: payload.fullWidth ? (payload.type == 'primary' ? 4 : 1) : payload.x - px - tw / 2,
            y: Math.round(payload.y) - th / 2 - py + 1,
            width: payload.fullWidth ? this.width - (payload.type == 'primary' ? 8 : 2) : tw + px * 2,
            height: th + py * 2
        });
        if (payload.color) {
            if (payload.line) {
                ctx.lineWidth = 1;
                this.line(0, payload.y, this.width, payload.y, payload.color);
            }
            ctx.lineJoin = 'round';
            ctx.strokeStyle = payload.color;
            ctx.beginPath();
            if (payload.type == 'primary') {
                ctx.lineWidth = 8;
                px = 2;
                py = 0;
                ctx.fillStyle = payload.color;
            }
            else {
                ctx.lineWidth = 1;
                ctx.fillStyle = payload.bg || 'black';
            }
            const rect = calculateRect();
            ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
            ctx.rect(rect.x, rect.y, rect.width, rect.height);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
        ctx.fillStyle = payload.type == 'primary' ? 'white' : payload.color;
        ctx.fillText(payload.text, payload.x, payload.y + 1);
        ctx.lineWidth = 1;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        return calculateRect();
    }
    static isInside(pos, rect) {
        return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y;
    }
    getLines(text, maxWidth, ctx = this.ctx) {
        var words = text.split(' ');
        var lines = [];
        var currentLine = words[0];
        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            }
            else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
}
export * from './v-element';
export * from './interactive';
export * from './label';
export * from './button';
export * from './position';
