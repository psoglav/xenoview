export class EventEmitter {
  static dispatch(name: string, payload: any) {
    name = '__xenoview__' + name
    const event = new CustomEvent(name, {
      detail: payload,
      bubbles: true,
      cancelable: true,
      composed: false
    })
    window.dispatchEvent(event)
  }
  static on(e: ChartEventType, cb: (e: CustomEvent) => void) {
    window.addEventListener('__xenoview__' + e, cb)
  }
}
