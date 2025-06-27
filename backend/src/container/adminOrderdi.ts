import { AdminOrderRepository } from "../repositories/adminOrderRepository";

import { AdminOrderService } from "../services/adminOrderService";
import { AdminOrderController } from "../controllers/adminOrderController";

const adminOrderRepository=new AdminOrderRepository();



const adminOrderService=new AdminOrderService(adminOrderRepository);
export const adminOrderController=new AdminOrderController(adminOrderService)
