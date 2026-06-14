import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { CustomerOrderController } from "../../controllers/customer/order.controller";


const customerorderrouter = Router();
const controller = new CustomerOrderController();

// 👤 customer create order
customerorderrouter.post(
  "/",
  authenticate,
  authorize("customer"),
  controller.createOrder.bind(controller)
);

// 📦 customer view orders (search + filter)
customerorderrouter.get(
  "/",
  authenticate,
  authorize("customer"),
  controller.getMyOrders.bind(controller)
);

export default customerorderrouter;