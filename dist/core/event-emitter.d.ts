export declare class EventEmitter {
    static dispatch(name: string, payload: any): void;
    static on(e: ChartEventType, cb: (e: CustomEvent) => void): void;
}
