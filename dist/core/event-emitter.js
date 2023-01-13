export class EventEmitter {
    static dispatch(name, payload) {
        name = '__xenoview__' + name;
        const event = new CustomEvent(name, {
            detail: payload,
            bubbles: true,
            cancelable: true,
            composed: false
        });
        window.dispatchEvent(event);
    }
    static on(e, cb) {
        window.addEventListener('__xenoview__' + e, cb);
    }
}
