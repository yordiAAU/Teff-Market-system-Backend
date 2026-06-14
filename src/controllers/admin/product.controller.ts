import { Request, Response } from "express";
import { ProductService } from "../../service/admin/product.service";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../../validation/admin/product.vslidation";
import { getUploadedFiles } from "../../lib/uplode";
import { uploadMulterFiles } from "../../lib/cloudinary_upload";

export class ProductController {
  async getProducts(req: Request, res: Response) {
    const parsed = productQuerySchema.parse(req.query);

    const products = await ProductService.getAllProducts(
      parsed.query,
      parsed.page,
      parsed.pageSize
    );

    return res.json(products);
  }

  async createProduct(req: Request, res: Response) {
    const data = createProductSchema.parse(req.body);

      const files = getUploadedFiles(req);
    
      const uploads = await uploadMulterFiles(files, {
        folder: "farm-market/producttype",
      });
    
      const imageUrls = uploads.map(
        (upload) => upload.secure_url
      );

    const product = await ProductService.createProduct(data , imageUrls);

    return res.status(201).json(product);
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;

      if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    const data = updateProductSchema.parse(req.body);

    const product = await ProductService.updateProduct(id, data);

    return res.json(product);
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

      if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

    await ProductService.deleteProduct(id);

    return res.json({ message: "Product soft deleted" });
  }

  async getProduct(req: Request, res: Response) {
    const { id } = req.params;

      if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

    const product = await ProductService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.json(product);
  }
}