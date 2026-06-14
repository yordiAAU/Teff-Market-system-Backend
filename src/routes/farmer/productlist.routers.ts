import { Router } from "express";



import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { ProductListController } from "../../controllers/farmer/product-list.controller";
import { upload } from "../../lib/uplode";

const productlistrouter = Router();
const controller = new ProductListController();

// 👨‍🌾 farmer listings
productlistrouter.get(
  "/my",
  authenticate,
  authorize("farmer"),
  controller.getMyListings.bind(controller)
);

// 📦 product types for dropdown
productlistrouter.get(
  "/product-types",
  authenticate,
  controller.getProductTypes.bind(controller)
);

// ➕ create listing
productlistrouter.post(
  "/",
  authenticate,
  authorize("farmer"),
  upload.array("images", 10),
  controller.createListing.bind(controller)
);

// ✏️ update listing
productlistrouter.put(
  "/:id",
  authenticate,
  authorize("farmer"),
  controller.updateListing.bind(controller)
);

// 🗑 soft delete
productlistrouter.delete(
  "/:id",
  authenticate,
  authorize("farmer"),
  controller.deleteListing.bind(controller)
);

export default productlistrouter;