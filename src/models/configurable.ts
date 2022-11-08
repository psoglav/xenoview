export default interface Configurable<Options> {
  _opts: Options
  applyOptions(opts: Partial<Options>): void
}
