"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSalesTrend = generateSalesTrend;
function generateSalesTrend(orders) {
    const map = {};
    orders.forEach((order) => {
        if (order.status !== 'paid')
            return;
        const date = new Date(order.createdAt).toISOString().slice(0, 10);
        map[date] = (map[date] || 0) + order.amount;
    });
    return Object.entries(map).map(([date, sales]) => ({ date, sales }));
}
//# sourceMappingURL=analyticHelper.js.map