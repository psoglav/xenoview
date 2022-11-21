import { Component } from '../core';
export default class Loader extends Component {
    constructor(chart) {
        super(chart);
        this.create();
    }
    set isActive(value) {
        this.el.style.opacity = value ? '1' : '0';
        this.chart.canvas.style.opacity = value ? '0.3' : '1';
    }
    create() {
        let xmlns = 'http://www.w3.org/2000/svg';
        let boxWidth = '65';
        let boxHeight = '65';
        this.el = document.createElementNS(xmlns, 'svg');
        this.el.id = '#cryptoview-spinner';
        this.el.style.color = this.chart.options.spinnerColor;
        this.el.setAttributeNS(null, 'viewBox', '0 0 256 256');
        this.el.setAttributeNS(null, 'width', boxWidth);
        this.el.setAttributeNS(null, 'height', boxHeight);
        this.el.style.display = 'block';
        this.el.style.position = 'absolute';
        this.el.style.left = 'calc(50% - 70px)';
        this.el.style.top = 'calc(50% - 28px)';
        this.el.style.transform = 'translate(-50%, -50%)';
        this.el.style.transition = 'all .1s ease';
        this.el.style.pointerEvents = 'none';
        let path = document.createElementNS(xmlns, 'path');
        path.setAttributeNS(null, 'stroke', 'currentColor');
        path.setAttributeNS(null, 'fill', 'currentColor');
        path.setAttributeNS(null, 'd', 'M228,128A100,100,0,1,1,86.3,37.1a4,4,0,1,1,3.4,7.2,92,92,0,1,0,76.6,0,3.9,3.9,0,0,1-1.9-5.3,4,4,0,0,1,5.3-1.9A100.2,100.2,0,0,1,228,128Z');
        this.el.style.animation = '0.5s linear infinite rotate';
        this.el.appendChild(path);
        this.chart.container.appendChild(this.el);
    }
    update() { }
}
