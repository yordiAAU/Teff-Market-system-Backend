import { CustomerDashboardService } from "../../service/customers/dashbord.service";
import { Request, Response } from "express";


export class CustomerDashboardController {
   async overview(
    req: Request,
    res: Response
  ) {
    const data =
      await CustomerDashboardService.getOverview(
        req.user!.userId
      );

    return res.json(data);
  }

   async spendingTrend(
    req: Request,
    res: Response
  ) {
    const data =
      await CustomerDashboardService.getSpendingTrend(
        req.user!.userId
      );

    return res.json(data);
  }

   async recentOrders(
    req: Request,
    res: Response
  ) {
    const data =
      await CustomerDashboardService.getRecentOrders(
        req.user!.userId
      );

    return res.json(data);
  }

   async distribution(
    req: Request,
    res: Response
  ) {
    const data =
      await CustomerDashboardService.getOrderDistribution(
        req.user!.userId
      );

    return res.json(data);
  }

   async favoriteProduct(
    req: Request,
    res: Response
  ) {
    const data =
      await CustomerDashboardService.getFavoriteProduct(
        req.user!.userId
      );

    return res.json(data);
  }
}