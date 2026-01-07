
import { OrderData } from '../types';
import { getDbInstance } from './dbService';
import { sendOrderToTelegram } from './telegram';

export const orderService = {
  getAll: async (): Promise<OrderData[]> => {
    const db = await getDbInstance();
    // @ts-ignore
    return db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
  },
  
  create: async (order: OrderData) => {
    const db = await getDbInstance();
    
    // Telegramga xabar yuborish
    const tgSuccess = await sendOrderToTelegram(order);
    
    // DBga buyurtmani saqlash
    await db.collection('orders').insertOne(order);
    
    // Zaxirani (stock) kamaytirish
    for (const item of order.items) {
      await db.collection('products').updateOne(
        { id: item.product.id },
        { $inc: { stock: -item.quantity } }
      );
    }
    
    return tgSuccess;
  },
  
  updateStatus: async (orderId: string, status: OrderData['status']) => {
    const db = await getDbInstance();
    await db.collection('orders').updateOne(
      { id: orderId },
      { $set: { status } }
    );
  }
};
