import { prisma } from "../../lib/prisma";
import {
  UserRole,
  ListingStatus,
} from "@prisma/client";

export class AdminDashboardService {

    static async getRecentOrders() {
  return prisma.order.findMany({
    take: 10,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      customer: {
        select: {
          fullName: true,
        },
      },

      farmer: {
        select: {
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

    static async getPlatformGrowth() {
  const currentYear =
    new Date().getFullYear();

  const result = [];

  for (
    let month = 0;
    month < 12;
    month++
  ) {
    const start = new Date(
      currentYear,
      month,
      1
    );

    const end = new Date(
      currentYear,
      month + 1,
      1
    );

    const [users, orders] =
      await Promise.all([
        prisma.user.count({
          where: {
            createdAt: {
              gte: start,
              lt: end,
            },
          },
        }),

        prisma.order.count({
          where: {
            createdAt: {
              gte: start,
              lt: end,
            },
          },
        }),
      ]);

    result.push({
      month: start.toLocaleString(
        "default",
        {
          month: "short",
        }
      ),
      users,
      orders,
    });
  }

  return result;
}

    static async getMarketStats(
  productTypeId: string
) {
  const startOfDay = new Date();

  startOfDay.setHours(
    0,
    0,
    0,
    0
  );

  const stats =
    await prisma.listing.aggregate({
      where: {
        productTypeId,
        createdAt: {
          gte: startOfDay,
        },
      },

      _avg: {
        pricePerKg: true,
      },

      _max: {
        pricePerKg: true,
      },

      _min: {
        pricePerKg: true,
      },
    });

  const avg = Number(
    stats._avg.pricePerKg ?? 0
  );

  const high = Number(
    stats._max.pricePerKg ?? 0
  );

  const low = Number(
    stats._min.pricePerKg ?? 0
  );

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

  const data = await prisma.listing.findMany({
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

  return data.map((item) => ({
    date: item.createdAt,
    price: Number(item.pricePerKg),
  }));
}

  static async getOverview() {
    const [
      totalUsers,
      verifiedFarmers,
      totalOrders,
      activeProducts,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          role: UserRole.farmer
         
        },
      }),

      prisma.order.count(),

      prisma.listing.count({
        where: {
          status: ListingStatus.active,
        },
      }),
    ]);

    return {
      totalUsers,
      verifiedFarmers,
      totalOrders,
      activeProducts,
    };
  }
}