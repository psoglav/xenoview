import { Component } from '../../core';
export default class Trading extends Component {
    orders: OrderModel[];
    get positions(): OrderModel[];
    get currentPrice(): number;
    private elements;
    constructor();
    update(): void;
    updateOrder(id: string, payload: Partial<OrderModel>): void;
    updateOrders(items: OrderModel[]): void;
    executeOrder(order: OrderModel): void;
    openPosition(order: OrderModel): void;
    closePosition(value: OrderModel | string, status?: Exclude<OrderStatus, 'working'>): void;
}
