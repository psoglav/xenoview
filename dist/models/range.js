import { assert } from '@/utils';
export default class Range {
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    constructor(start, end) {
        assert(start < end, 'start should be less than end');
        this._start = start;
        this._end = end;
    }
    contains(value) {
        return this.start >= value && value <= this.end;
    }
    equals(other) {
        return other.start === this.start && other.end === this.end;
    }
    static from(s) {
    }
}
