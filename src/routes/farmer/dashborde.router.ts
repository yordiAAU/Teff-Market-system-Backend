import { FarmerDashboardController } from "../../controllers/farmer/dashbord.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { Router } from "express";


const farmerDashboardRouter = Router();

const controller = new FarmerDashboardController();

farmerDashboardRouter.get(
  "/dashboard/overview",
  authenticate,
  authorize("farmer"),
    controller.overview.bind(controller)
);

farmerDashboardRouter.get(
  "/dashboard/trend",
  authenticate,
  authorize("farmer"),
  controller.trend.bind(controller)
);

farmerDashboardRouter.get(
  "/dashboard/stats/:productTypeId",
  authenticate,
  authorize("farmer"),
  controller.stats.bind(controller)
);

farmerDashboardRouter.get(
  "/dashboard/recent-sales",
  authenticate,
  authorize("farmer"),
  controller.recentSales.bind(controller)
);

export default farmerDashboardRouter;