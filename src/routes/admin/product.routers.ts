import { Router } from "express";
import { ProductController } from "../../controllers/admin/product.controller";


import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { upload } from "../../lib/uplode";



const adminproductrouter = Router();
const controller = new ProductController();

adminproductrouter.get(
  "/",
  authenticate,
  authorize("admin"),
  controller.getProducts.bind(controller)
);

adminproductrouter.get(
  "/:id",
  authenticate,
  authorize("admin"),
  controller.getProduct.bind(controller)
);

adminproductrouter.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.array("images", 10),
  controller.createProduct.bind(controller)
);

adminproductrouter.put(
  "/:id",
  authenticate,
  authorize("admin"),
  controller.updateProduct.bind(controller)
);

adminproductrouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  controller.deleteProduct.bind(controller)
);

export default adminproductrouter;