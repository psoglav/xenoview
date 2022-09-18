"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.symbolToCurrency = void 0;
const scmap_json_1 = __importDefault(require("../data/scmap.json"));
const symbolToCurrency = (value) => scmap_json_1.default[value.toUpperCase()];
exports.symbolToCurrency = symbolToCurrency;
//# sourceMappingURL=crypto.js.map