import { Request, Response } from "express";
import { ProductListService } from "../../service/farmer/productlist.service";
import { createProductListSchema, updateProductListSchema } from "../../validation/farmer/productlist.validation";
import { getUploadedFiles } from "../../lib/uplode";
import { uploadMulterFiles } from "../../lib/cloudinary_upload";


export class ProductListController {
  async getMyListings(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
         return res.status(404).json({ message: "user Not found" });

    }

    const data = await ProductListService.getProductList(userId);

    res.json(data);
  }

  async getProductTypes(req: Request, res: Response) {
    const data = await ProductListService.getProductsName();

    res.json(data);
  }

  // async createListing(req: Request, res: Response) {
  //   const userId = req.user?.userId;

  //   if (!userId) {
  //        return res.status(404).json({ message: "user Not found" });

  //   }

  //   const parsed = createProductListSchema.parse(req.body);

  //   const listing = await ProductListService.addProduct(userId, parsed);

  //   res.status(201).json(listing);
  // }



async createListing(req: Request, res: Response) {
  const userId = req.user!.userId;

  const data = createProductListSchema.parse(req.body);

  const files = getUploadedFiles(req);

  const uploads = await uploadMulterFiles(files, {
    folder: "farm-market/listings",
  });

  const imageUrls = uploads.map(
    (upload) => upload.secure_url
  );

  const listing = await ProductListService.addProduct(
    userId,
    data,
    imageUrls
  );

  return res.status(201).json(listing);
}

  async updateListing(req: Request, res: Response) {
       const userId = req.user?.userId;

    if (!userId) {
         return res.status(404).json({ message: "user Not found" });

    }
    const { id } = req.params;

        if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

    const parsed = updateProductListSchema.parse(req.body);

    const updated = await ProductListService.updateProduct(
      userId,
      id,
      parsed
    );

    res.json(updated);
  }

  async deleteListing(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
         return res.status(404).json({ message: "user Not found" });

    }
    const { id } = req.params;

        if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

    await ProductListService.deleteProduct(userId, id);

    res.json({ message: "Listing soft deleted" });
  }
}