import { Canvas, Component } from '../core';
export declare const PROMPTS: {
    zooming: string;
};
export default class Prompt extends Component {
    value: string;
    constructor();
    update(canvas: Canvas): void;
}
