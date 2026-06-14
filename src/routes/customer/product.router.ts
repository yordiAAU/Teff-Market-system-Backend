import { Router } from "express";
import { CustomerProductController } from "../../controllers/customer/product.controller";
import { authenticate } from "../../middleware/authenticate";


const customerproductrouter = Router();
const controller = new CustomerProductController();

// 📦 list product types (shop homepage)
customerproductrouter.get(
  "/",
  authenticate,
  controller.getProductTypes.bind(controller)
);

// 📊 product type detail (farmers + filters + sorting)
customerproductrouter.get(
  "/:id",
  authenticate,
  controller.getProductTypeDetail.bind(controller)
);

// 👨‍🌾 single farmer listing detail
customerproductrouter.get(
  "/:productId/farmer/:farmerId",
  authenticate,
  controller.getListingDetail.bind(controller)
);

export default customerproductrouter;