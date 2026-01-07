
import { OrderData } from '../types';
import { getDb, updateDb } from './dbService';
import { sendOrderToTelegram } from './telegram';

export const orderService = {
  getAll: async () => {
    const db = await getDb();
    return db.orders;
  },
  
  create: async (order: OrderData) => {
    const db = await getDb();
    
    // Telegramga yuborish
    const tgSuccess = await sendOrderToTelegram(order);
    
    // Zaxirani yangilash
    const newProducts = db.products.map(p => {
      const item = order.items.find(i => i.product.id === p.id);
      if (item) return { ...p, stock: p.stock - item.quantity };
      return p;
    });
    
    const newOrders = [...db.orders, order];
    await updateDb({ ...db, orders: newOrders, products: newProducts });
    
    return tgSuccess;
  },
  
  updateStatus: async (orderId: string, status: OrderData['status']) => {
    const db = await getDb();
    const newOrders = db.orders.map(o => o.id === orderId ? { ...o, status } : o);
    await updateDb({ ...db, orders: newOrders });
  }
};
