import { Router } from "express";
import { OrderController } from "../../controllers/farmer/order.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";


const farmerorderrouter = Router();
const controller = new OrderController();

// 👨‍🌾 farmer orders
farmerorderrouter.get(
  "/",
  authenticate,
  authorize("farmer"),
  controller.getFarmerOrders.bind(controller)
);

// 🔄 update order status
farmerorderrouter.patch(
  "/:id/status",
  authenticate,
  authorize("farmer"),
  controller.updateOrderStatus.bind(controller)
);

export default farmerorderrouter;