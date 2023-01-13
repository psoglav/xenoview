export class VElement {
    get position() {
        return {
            x: this._position.x,
            y: this._position.y
        };
    }
    get rect() {
        const { x: px, y: py } = this._padding;
        const rect = Object.assign({}, this._rect);
        rect.x -= px;
        rect.y -= py;
        rect.width += px * 2;
        rect.height += py * 2;
        return rect;
    }
    set rect(value) {
        this._rect = value;
    }
    get chart() {
        return window.xenoview;
    }
    get ctx() {
        return this.canvas.getContext('2d');
    }
    get canvasRect() {
        return this.canvas.getBoundingClientRect();
    }
    constructor(canvas) {
        this._position = { x: 0, y: 0 };
        this.isDestroyed = false;
        this.origin = { x: 0, y: 0 };
        this._padding = { x: 0, y: 0 };
        this._rect = { x: 0, y: 0, width: 0, height: 0 };
        this._id = +new Date();
        this.canvas = canvas;
    }
    setPosition(x, y) {
        this._position = { x, y };
    }
    setOrigin(x, y) {
        this.origin = { x, y };
    }
    setPadding(x, y) {
        this._padding = { x, y };
    }
    isInside(pos) {
        return (pos.x > this.rect.x &&
            pos.x < this.rect.x + this.rect.width &&
            pos.y < this.rect.y + this.rect.height &&
            pos.y > this.rect.y);
    }
}
