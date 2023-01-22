import { Component, EventEmitter, Position, } from '../../core';
export default class Trading extends Component {
    get positions() {
        var _a;
        return (_a = this.orders) === null || _a === void 0 ? void 0 : _a.filter(el => el.status == 'working');
    }
    get currentPrice() {
        return this.chart.dataProvider.state.PRICE;
    }
    constructor() {
        super();
        this.orders = [];
        this.elements = [];
    }
    update() {
        this.positions.forEach(item => {
            const { side, type, price } = item;
            if (this.currentPrice > price && ((side == 'sell' && type == 'limit') || (side == 'buy' && type == 'stop'))) {
                this.executeOrder(item);
            }
            if (price > this.currentPrice && ((side == 'buy' && type == 'limit') || (side == 'sell' && type == 'stop'))) {
                this.executeOrder(item);
            }
            if (item.type === 'market') {
                item.price = this.currentPrice;
                this.executeOrder(item);
            }
        });
        this.elements = this.elements.filter(el => !el.isDestroyed);
        this.elements.forEach(element => {
            if (element.options.price)
                element.update();
        });
    }
    updateOrder(id, payload) {
        const i = this.orders.findIndex((item) => item.id === id);
        Object.keys(key => {
            if (key in this.orders[i]) {
                this.orders[i][key] = payload[key];
            }
        });
    }
    updateOrders(items) {
        this.orders = items;
        this.orders.forEach(item => {
            if (!item.id) {
                item.id = this.orders.length.toString(16);
                item.deltaPrice = 0;
                item.status = 'working';
                item.at = +new Date();
            }
            this.openPosition(item);
        });
    }
    executeOrder(order) {
        this.closePosition(order, 'fulfilled');
        EventEmitter.dispatch('trading:order-fulfilled', order);
    }
    openPosition(order) {
        if (this.elements.findIndex(el => el.options.id === order.id) != -1)
            return;
        const position = new Position(this.chart.uiLayer.canvas, order);
        this.elements.push(position);
    }
    closePosition(value, status = 'canceled') {
        const id = typeof value === 'string' ? value : value.id;
        const i = this.orders.findIndex(el => el.id === id);
        this.orders[i].status = status;
        this.elements.forEach((el) => {
            var _a;
            if (((_a = el.options) === null || _a === void 0 ? void 0 : _a.id) === id) {
                el.destroy();
            }
        });
    }
}
