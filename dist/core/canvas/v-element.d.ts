import Destroyable from '../../models/destroyable';
export declare abstract class VElement implements Destroyable {
    _id: number;
    private _position;
    isDestroyed: boolean;
    origin: Vector;
    _padding: Vector;
    _rect: Rect;
    canvas: HTMLCanvasElement;
    get position(): Vector;
    get rect(): Rect;
    set rect(value: Rect);
    get chart(): import("..").Chart;
    get ctx(): CanvasRenderingContext2D;
    get canvasRect(): DOMRect;
    constructor(canvas: HTMLCanvasElement);
    abstract update(): void;
    abstract draw(): void;
    abstract onMouseEnter(e: MouseEvent): void;
    abstract onMouseMove(e: MouseEvent): void;
    abstract onMouseLeave(e: MouseEvent): void;
    abstract onMouseDown(e: MouseEvent): void;
    abstract onMouseUp(e: MouseEvent): void;
    abstract destroy(): void;
    setPosition(x: number, y: number): void;
    setOrigin(x: number, y: number): void;
    setPadding(x: number, y: number): void;
    isInside(pos: Vector): boolean;
}
