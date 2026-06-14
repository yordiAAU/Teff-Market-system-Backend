import { Request, Response } from "express";
import { createOrderSchema, customerOrderQuerySchema } from "../../validation/customer/customer-order.validation";
import { CustomerOrderService } from "../../service/customers/order.service";


export class CustomerOrderController {
  async createOrder(req: Request, res: Response) {
    const customerId =  req.user?.userId;;

    if (!customerId) {
         return res.status(404).json({ message: "user Not found" });

    };

    const parsed = createOrderSchema.parse(req.body);

    const order = await CustomerOrderService.createOrder(
      customerId,
      parsed.listingId,
      parsed.quantity
    );

    res.status(201).json(order);
  }

  async getMyOrders(req: Request, res: Response) {
    const customerId =  req.user?.userId;;

    if (!customerId) {
         return res.status(404).json({ message: "user Not found" });

    };

    const parsed = customerOrderQuerySchema.parse(req.query);

    const orders = await CustomerOrderService.getOrdersByCustomer(
      customerId,
      parsed.status,
      parsed.query,
      parsed.page,
      parsed.pageSize
    );

    res.json(orders);
  }
}