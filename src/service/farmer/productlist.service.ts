import { ListingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateProductListType } from "../../validation/farmer/productlist.validation";


export class ProductListService {
  // ✅ GET ALL LISTINGS (farmer only)
  static async getProductList(farmerId: string) {
  return prisma.listing.findMany({
    where: {
      farmerId,
    },
    include: {
      productType: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}


  // ✅ GET PRODUCT TYPES (for dropdown)
  static async getProductsName() {
    return prisma.productType.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  // ✅ CREATE LISTING (FIXED + SAFE TRANSACTION)


  static async addProduct(
    userId: string,
    productData: CreateProductListType,
    imageUrls: string[]
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const productType = await prisma.productType.findFirst({
      where: {
        id: productData.productTypeId,
        isActive: true,
      },
    });

    if (!productType) {
      throw new Error("Invalid product type");
    }

    const listing = await prisma.listing.create({
      data: {
        farmerId: userId,
        productTypeId: productData.productTypeId,
        quantity: parseFloat(productData.quantity),
        unit: productData.unit,
        pricePerKg: parseFloat(productData.price),
        description: productData.description,
        location: user.region,
      },
    });

    if (imageUrls.length) {
      await prisma.listingImage.createMany({
        data: imageUrls.map((url) => ({
          listingId: listing.id,
          imageUrl: url,
        })),
      });
    }

    return prisma.listing.findUnique({
      where: { id: listing.id },
      include: {
        images: true,
        productType: true,
      },
    });
  }
  // ✅ UPDATE LISTING
  static async updateProduct(
    farmerId: string,
    listingId: string,
    data: any
  ) {
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        farmerId,
        isActive: true,
      },
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    // update listing
    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: {
        quantity: data.quantity ?? listing.quantity,
        unit: data.unit ?? listing.unit,
        pricePerKg: data.price ? parseFloat(data.price) : listing.pricePerKg,
        description: data.description ?? listing.description,
      },
    });

    // optional image replace
    if (data.images?.length) {
      await prisma.listingImage.deleteMany({
        where: { listingId },
      });

      await prisma.listingImage.createMany({
        data: data.images.map((url: string) => ({
          listingId,
          url,
        })),
      });
    }

    return updated;
  }

  // ✅ SOFT DELETE
  static async deleteProduct(farmerId: string, listingId: string) {
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        farmerId,
      },
    });

    if (!listing) throw new Error("Listing not found");

    return prisma.listing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.inactive,
      },
    });
  }
}