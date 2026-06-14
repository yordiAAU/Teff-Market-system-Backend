import { prisma } from "../../lib/prisma";
import { ListingStatus } from "@prisma/client";

export class CustomerProductService {
  // ======================================================
  // 1. PRODUCT TYPE LIST (with min/max price + preview)
  // ======================================================
  static async getProductTypes(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const productTypes = await prisma.productType.findMany({
      where: {
        isActive: true,
      },
      skip,
      take: pageSize,
      include: {
        listings: {
          where: {
            status: ListingStatus.active,
          },
          select: {
            pricePerKg: true,
            images:  true,
          },
        },
      },
    });

    return productTypes.map((pt) => {
      const prices = pt.listings.map((l) => Number(l.pricePerKg));

      return {
        id: pt.id,
        name: pt.name,
        description: pt.description,

        minPrice: prices.length ? Math.min(...prices) : null,
        maxPrice: prices.length ? Math.max(...prices) : null,
        previewImage: pt.listings[0]?.images[0]?.imageUrl || null,
      };
    });
  }

  // ======================================================
  // 2. PRODUCT TYPE DETAIL (farmers + filters)
  // ======================================================
  static async getProductTypeDetail(
    productTypeId: string,
    query: {
    page?: number | undefined;
    pageSize?: number | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    location?: string | undefined;
    farmerName?: string | undefined;
    sort?: "price_asc" | "price_desc" | undefined;
  }
  ) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const where: any = {
      productTypeId
    };

    // price filter
    if (query.minPrice || query.maxPrice) {
      where.pricePerKg = {};
      if (query.minPrice) where.pricePerKg.gte = query.minPrice;
      if (query.maxPrice) where.pricePerKg.lte = query.maxPrice;
    }

    // location filter
    if (query.location) {
      where.location = {
        contains: query.location,
        mode: "insensitive",
      };
    }

    // farmer name filter
    if (query.farmerName) {
      where.farmer = {
        fullName: {
          contains: query.farmerName,
          mode: "insensitive",
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,

      orderBy:
        query.sort === "price_desc"
          ? { pricePerKg: "desc" }
          : query.sort === "price_asc"
          ? { pricePerKg: "asc" }
          : { createdAt: "desc" },

      include: {
        farmer: {
          select: {
            id: true,
            fullName: true,
            region: true,
          },
        },
        images: true
      },
    });

    const total = await prisma.listing.count({ where });

    const productType = await prisma.productType.findUnique({
      where: { id: productTypeId },
    });

    return {
      productType,
      listings,
      pagination: {
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  // ======================================================
  // 3. SINGLE FARMER LISTING DETAIL
  // ======================================================
  static async getListingDetail(productId: string, farmerId: string) {
    return prisma.listing.findFirst({
      where: {
        id: productId,
        farmerId,
      },
      include: {
        productType: true,
        images: true,
        farmer: {
          select: {
            id: true,
            fullName: true,
            region: true,
          },
        },
      },
    });
  }
}