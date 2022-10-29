export default class Range<T extends number> {
    private readonly _start;
    private readonly _end;
    get start(): T;
    get end(): T;
    constructor(start: T, end: T);
    contains(value: number): boolean;
    equals(other: Range<T>): boolean;
}
