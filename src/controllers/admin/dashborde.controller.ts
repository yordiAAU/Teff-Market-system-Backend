import { AdminDashboardService } from "../../service/admin/dashborde.service";
import { Request, Response } from "express";
import { marketTrendSchema } from "../../validation/farmer/dashboard.validation";


export class AdminDashboardController {
   async overview(
    req: Request,
    res: Response
  ) {
    const data =
      await AdminDashboardService.getOverview();

    return res.json(data);
  }

   async marketTrend(
    req: Request,
    res: Response
  ) {
    const query =
      marketTrendSchema.parse(req.query);

    const data =
      await AdminDashboardService.getMarketTrend(
        query.productTypeId,
        query.period
      );

    return res.json(data);
  }

   async marketStats(
    req: Request,
    res: Response
  ) {
    const productTypeId =
      req.params.productTypeId;

          if (!productTypeId || Array.isArray(productTypeId)) {
    return res.status(400).json({
      message: "Invalid product type id",
    });
  }


    const data =
      await AdminDashboardService.getMarketStats(
        productTypeId
      );

    return res.json(data);
  }

   async platformGrowth(
    req: Request,
    res: Response
  ) {
    const data =
      await AdminDashboardService.getPlatformGrowth();

    return res.json(data);
  }

   async recentOrders(
    req: Request,
    res: Response
  ) {
    const data =
      await AdminDashboardService.getRecentOrders();

    return res.json(data);
  }
}