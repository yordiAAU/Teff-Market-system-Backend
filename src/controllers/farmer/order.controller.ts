import { Request, Response } from "express";
import { orderQuerySchema, updateOrderStatusSchema } from "../../validation/farmer/order.validation";
import { OrderService } from "../../service/farmer/order.service";


export class OrderController {
  async getFarmerOrders(req: Request, res: Response) {
    const farmerId = req.user!.userId;



    const parsed = orderQuerySchema.parse(req.query);

    const orders = await OrderService.getOrdersByFarmer(
      farmerId,
      parsed.query,
      parsed.status,
      parsed.page,
      parsed.pageSize
    );

    res.json(orders);
  }

  async updateOrderStatus(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

    const parsed = updateOrderStatusSchema.parse(req.body);

    const updated = await OrderService.updateOrderStatus(
      id,
      parsed.status
    );

    res.json(updated);
  }
}