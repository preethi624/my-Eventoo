import { IOrder } from "src/model/order";

export function generateSalesTrend(orders: IOrder[]) {
  const map: Record<string, number> = {};

  orders.forEach((order) => {
    if (order.status !== 'paid') return;

    const date = new Date(order.createdAt).toISOString().slice(0, 10);
    map[date] = (map[date] || 0) + order.amount;
  });

  return Object.entries(map).map(([date, sales]) => ({ date, sales }));
}
