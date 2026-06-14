import { prisma } from "../../lib/prisma";
import { OrderStatus, ListingStatus } from "@prisma/client";

export class FarmerDashboardService {

    static async getRecentSales(
  farmerId: string
) {
  return prisma.order.findMany({
    where: {
      farmerId,
    },

    take: 10,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
        },
      },

      listing: {
        include: {
          productType: true,
        },
      },
    },
  });
}

    static async getPriceStats(
  productTypeId: string
) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const stats = await prisma.listing.aggregate({
    where: {
      productTypeId,
      createdAt: {
        gte: today,
      },
    },

    _avg: {
      pricePerKg: true,
    },

    _min: {
      pricePerKg: true,
    },

    _max: {
      pricePerKg: true,
    },
  });

  const avg =
    Number(stats._avg.pricePerKg ?? 0);

  const high =
    Number(stats._max.pricePerKg ?? 0);

  const low =
    Number(stats._min.pricePerKg ?? 0);

  return {
    averagePrice: avg,
    dailyHigh: high,
    dailyLow: low,
    range: high - low,
  };
}

 static async getMarketTrend(
  productTypeId: string,
  period: "today" | "week" | "month" | "year"
) {
  const now = new Date();

  const startDate = new Date();

  switch (period) {
    case "today":
      startDate.setHours(now.getHours() - 24);
      break;

    case "week":
      startDate.setDate(now.getDate() - 7);
      break;

    case "month":
      startDate.setDate(now.getDate() - 28);
      break;

    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  const listings = await prisma.listing.findMany({
    where: {
      productTypeId,
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
      pricePerKg: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return listings.map((item) => ({
    date: item.createdAt,
    price: Number(item.pricePerKg),
  }));
}


  static async getOverview(farmerId: string) {
    const [
      revenue,
      totalOrders,
      totalProducts,
      activeListings,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          farmerId,
          status: OrderStatus.completed,
        },
        _sum: {
          totalPrice: true,
        },
      }),

      prisma.order.count({
        where: {
          farmerId,
        },
      }),

      prisma.listing.count({
        where: {
          farmerId,
        },
      }),

      prisma.listing.count({
        where: {
          farmerId,
          status: ListingStatus.active,
        },
      }),
    ]);

    return {
      totalRevenue: Number(
        revenue._sum.totalPrice ?? 0
      ),
      totalOrders,
      totalProducts,
      activeListings,
    };
  }


}