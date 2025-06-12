"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = void 0;
const generateOrderId = () => {
    const date = new Date();
    const yyyyMMdd = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${yyyyMMdd}-${random}`;
};
exports.generateOrderId = generateOrderId;
//# sourceMappingURL=generateOrderId.js.map