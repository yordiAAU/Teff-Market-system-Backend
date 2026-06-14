import { Request, Response } from "express";
import { CustomerProductService } from "../../service/customers/product.service";
import { productTypeDetailQuerySchema } from "../../validation/customer/customer-product.validation";


export class CustomerProductController {
  async getProductTypes(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const data = await CustomerProductService.getProductTypes(
      page,
      pageSize
    );

    res.json(data);
  }

  async getProductTypeDetail(req: Request, res: Response) {
    const { id } = req.params;

    

    

    

    

        if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }
    

    const parsed = productTypeDetailQuerySchema.parse(req.query);

    

    const data = await CustomerProductService.getProductTypeDetail(
      id,
      parsed
    
    );

    res.json(data);
  }

  async getListingDetail(req: Request, res: Response) {
    const { productId, farmerId } = req.params;

        if (!productId || Array.isArray(productId)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

      if (!farmerId || Array.isArray(farmerId)) {
    return res.status(400).json({
      message: "Invalid farmer id",
    });
  }

    const data = await CustomerProductService.getListingDetail(
      productId,
      farmerId
    );

    res.json(data);
  }
}