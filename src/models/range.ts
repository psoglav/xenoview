import { assert } from '../utils'

export default class Range<T extends number> {
  private readonly _start: T
  private readonly _end: T

  public get start() {
    return this._start
  }

  public get end() {
    return this._end
  }

  constructor(start: T, end: T) {
    assert(start < end, 'start should be less than end')

    this._start = start
    this._end = end
  }

  contains(value: number) {
    return this.start >= value && value <= this.end
  }

  equals(other: Range<T>) {
    return other.start === this.start && other.end === this.end
  }

  static from(s: DateRange) {

  }
}
