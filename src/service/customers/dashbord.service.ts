import { prisma } from "../../lib/prisma";
import { OrderStatus } from "@prisma/client";

export class CustomerDashboardService {

   
  /*   static getOrderDistribution(id: any) {
        throw new Error("Method not implemented.");
    }
    static getFavoriteProduct(userId: string) {
        throw new Error("Method not implemented.");
    } */

  static async getSpendingTrend(
  customerId: string
) {
  const year =
    new Date().getFullYear();

  const result = [];

  for (
    let month = 0;
    month < 12;
    month++
  ) {
    const start = new Date(
      year,
      month,
      1
    );

    const end = new Date(
      year,
      month + 1,
      1
    );

    const spending =
      await prisma.order.aggregate({
        where: {
          customerId,
          status: OrderStatus.completed,

          createdAt: {
            gte: start,
            lt: end,
          },
        },

        _sum: {
          totalPrice: true,
        },
      });

    result.push({
      month: start.toLocaleString(
        "default",
        {
          month: "short",
        }
      ),

      amount: Number(
        spending._sum.totalPrice ?? 0
      ),
    });
  }

  return result;
}

static async getRecentOrders(
  customerId: string
) {
  return prisma.order.findMany({
    where: {
      customerId,
    },

    take: 10,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,

      status: true,

      totalPrice: true,

      createdAt: true,

      listing: {
        select: {
          productType: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

 static async getOrderDistribution(
  customerId: string
) {
  const orders =
    await prisma.order.findMany({
      where: {
        customerId,
      },

      select: {
        listing: {
          select: {
            productType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

  const total = orders.length;

  const grouped = new Map<
    string,
    number
  >();

  orders.forEach((order) => {
    const name =
      order.listing.productType.name;

    grouped.set(
      name,
      (grouped.get(name) ?? 0) + 1
    );
  });

  return Array.from(
    grouped.entries()
  ).map(([name, count]) => ({
    productType: name,

    count,

    percent:
      total === 0
        ? 0
        : Number(
            (
              (count / total) *
              100
            ).toFixed(1)
          ),
  }));
}

 static async getFavoriteProduct(
  customerId: string
) {
  const distribution =
    await this.getOrderDistribution(
      customerId
    );

  if (!distribution.length) {
    return null;
  }

  return distribution.sort(
    (a, b) => b.count - a.count
  )[0];
}

static async getOverview(customerId: string) {
    const [
      totalOrders,
      activeOrders,
      completedOrders,
      spent,
    ] = await Promise.all([
      prisma.order.count({
        where: {
          customerId,
        },
      }),

      prisma.order.count({
        where: {
          customerId,
          status: {
            in: [
              OrderStatus.pending,
              OrderStatus.approved,
            ],
          },
        },
      }),

      prisma.order.count({
        where: {
          customerId,
          status: OrderStatus.completed,
        },
      }),

      prisma.order.aggregate({
        where: {
          customerId,
          status: OrderStatus.completed,
        },

        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return {
      totalOrders,
      activeOrders,
      completedOrders,
      totalSpent: Number(
        spent._sum.totalPrice ?? 0
      ),
    };
  }
}