"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UI {
    constructor(ctx) {
        this.changeContext(ctx);
    }
    changeContext(ctx) {
        this.ctx = ctx;
    }
    label(text, x, y, size) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = size + 'px Arial';
        this.ctx.fillText(text, x, y);
    }
}
exports.default = UI;
//# sourceMappingURL=ui.js.map