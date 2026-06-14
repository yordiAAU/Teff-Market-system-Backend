
import { CustomerDashboardController } from "../../controllers/customer/dashborde.controller";
import { authenticate } from "../../middleware/authenticate";

import { Router } from "express";


const customerDashboardRouter = Router();

const controller = new CustomerDashboardController();


customerDashboardRouter.get(
  "/dashboard/overview",
  authenticate,
  controller.overview
);

customerDashboardRouter.get(
  "/dashboard/spending-trend",
  authenticate,
  controller.spendingTrend
);

customerDashboardRouter.get(
  "/dashboard/recent-orders",
  authenticate,
  controller.recentOrders
);

customerDashboardRouter.get(
  "/dashboard/distribution",
  authenticate,
  controller.distribution
);

customerDashboardRouter.get(
  "/dashboard/favorite-product",
  authenticate,
  controller.favoriteProduct
);

export default customerDashboardRouter;