import { FarmerDashboardService } from "../../service/farmer/dashboard.service";
import { marketTrendSchema } from "../../validation/farmer/dashboard.validation";
import { Request, Response } from "express";

export class FarmerDashboardController {
   async overview(
    req: Request,
    res: Response
  ) {
     const farmerId = req.user!.userId;

    const data =
      await FarmerDashboardService.getOverview(
        farmerId
      );

    return res.json(data);
  }

 async trend(
    req: Request,
    res: Response
  ) {
    const query =
      marketTrendSchema.parse(req.query);

    const data =
      await FarmerDashboardService.getMarketTrend(
        query.productTypeId,
        query.period
      );

    return res.json(data);
  }

 async stats(
    req: Request,
    res: Response
  ) {
    const { productTypeId } = req.params;

     if (!productTypeId || Array.isArray(productTypeId)) {
    return res.status(400).json({
      message: "Invalid product type id",
    });
  }

    const data =
      await FarmerDashboardService.getPriceStats(
        productTypeId
      );

    return res.json(data);
  }

  async recentSales(
    req: Request,
    res: Response
  ) {
     const farmerId = req.user!.userId;

    const data =
      await FarmerDashboardService.getRecentSales(
        farmerId
      );

    return res.json(data);
  }
}