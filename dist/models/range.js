"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@/utils/assertions");
class Range {
    constructor(start, end) {
        (0, assertions_1.assert)(start < end, 'start should be less than end');
        this._start = start;
        this._end = end;
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    contains(value) {
        return this.start >= value && value <= this.end;
    }
    equals(other) {
        return other.start === this.start && other.end === this.end;
    }
}
exports.default = Range;
//# sourceMappingURL=range.js.map