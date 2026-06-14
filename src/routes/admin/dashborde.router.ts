import { AdminDashboardController } from "../../controllers/admin/dashborde.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { Router } from "express";


const adminDashboardRouter = Router();

const controller = new AdminDashboardController();


adminDashboardRouter.get(
  "/dashboard/overview",
  authenticate,
  authorize("admin"),
 
   controller.overview.bind(
    controller
  )
);

adminDashboardRouter.get(
  "/dashboard/market-trend",
  authenticate,
  authorize("admin"),
  controller.marketTrend.bind(controller)
);

adminDashboardRouter.get(
  "/dashboard/market-stats/:productTypeId",
  authenticate,
  authorize("admin"),
  controller.marketStats.bind(controller)
);

adminDashboardRouter.get(
  "/dashboard/platform-growth",
  authenticate,
  authorize("admin"),
  controller.platformGrowth.bind(controller)
);

adminDashboardRouter.get(
  "/dashboard/recent-orders",
  authenticate,
  authorize("admin"),
  controller.recentOrders.bind(controller)
);

export default adminDashboardRouter;