import { Canvas } from '.';
export declare abstract class Component {
    get chart(): import("./chart").Chart;
    abstract update(canvas: Canvas): void;
}
