import { Component, Button, EventEmitter } from '../core';
export default class PlaceOrderButton extends Component {
    get isVisible() {
        return this.chart.pointer.isVisible;
    }
    constructor() {
        super();
        this.isMounted = false;
    }
    mount() {
        this.button = new Button(this.chart.uiLayer.canvas, 0, 0, {
            text: '+',
            textColor: { default: 'white' },
            fillColor: { default: '#ffffff33', hover: '#ffffff55', active: '#ffffff66' },
            padding: {
                x: 6,
                y: 4
            },
            click() {
                EventEmitter.dispatch('xenoview:place-order', { test: true });
            }
        });
    }
    update() {
        if (!this.isMounted) {
            this.mount();
            this.isMounted = true;
        }
        if (!this.isVisible)
            return;
        this.button.setPosition(this.chart.uiLayer.width - this.button.rect.width + 5, this.chart.mouse.y - this.chart.canvasRect.top);
        this.button.update();
    }
}
