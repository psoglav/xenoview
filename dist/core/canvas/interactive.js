import { VElement } from './v-element';
export class InteractiveVElement extends VElement {
    get isFocused() {
        return this.chart.focusedVElement === this._id && this.isHovered;
    }
    get state() {
        return this._state;
    }
    set state(value) {
        switch (value) {
            case 'default':
                this.chart.mouse.cursor = this.chart.mouse.DEFAULT_CURSOR;
                this.chart.mouse.isBlockedByUI = false;
                break;
            case 'active':
                this.chart.mouse.cursor = 'pointer';
                this.chart.mouse.isBlockedByUI = true;
                break;
            case 'hover':
                this.chart.mouse.cursor = 'pointer';
                this.chart.mouse.isBlockedByUI = true;
                break;
        }
        this._state = value;
    }
    get isHovered() {
        return this.state === 'hover';
    }
    get isClicked() {
        return this.state === 'active';
    }
    constructor(canvas) {
        super(canvas);
        this._listeners = {
            mouseleave: this._onMouseLeave.bind(this),
            mousemove: this._onMouseMove.bind(this),
            mousedown: this._onMouseDown.bind(this),
            mouseup: this._onMouseUp.bind(this)
        };
        this._state = 'default';
        this.isGrabbed = false;
        this.bind();
    }
    bind() {
        Object.keys(this._listeners).forEach(type => {
            this.canvas.addEventListener(type, this._listeners[type]);
        });
    }
    _onMouseLeave(e) {
        this.state = 'default';
    }
    _onMouseMove(e) {
        this.mouse = { x: e.clientX - this.canvasRect.x, y: e.clientY - this.canvasRect.y };
        if (this.isInside(this.mouse)) {
            if (!this.isHovered && !this.isClicked) {
                this.onMouseEnter(e);
                this.state = 'hover';
                if (!this.chart.focusedVElement || this.chart.focusedVElement < this._id)
                    this.chart.focusedVElement = this._id;
            }
            else if (this.isClicked) {
                this.isGrabbed = true;
            }
            this.onMouseMove(e);
        }
        else if (this.isHovered) {
            if (this.chart.focusedVElement > this._id)
                this.chart.focusedVElement = null;
            this.onMouseLeave(e);
            this.state = 'default';
        }
    }
    _onMouseDown(e) {
        if (this.isInside(this.mouse) && this.isFocused) {
            this.onMouseDown(e);
            this.state = 'active';
        }
    }
    _onMouseUp(e) {
        if (this.isInside(this.mouse)) {
            this.state = 'hover';
            this.onMouseUp(e);
        }
        else {
            this.state = 'default';
        }
        this.isGrabbed = false;
    }
    destroy() {
        Object.keys(this._listeners).forEach(type => {
            this.canvas.removeEventListener(type, this._listeners[type]);
        });
        this.state = 'default';
        this.isDestroyed = true;
    }
}
