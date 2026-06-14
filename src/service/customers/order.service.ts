import { prisma } from "../../lib/prisma";
import { OrderStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";




export class CustomerOrderService {
  // ==========================
  // CREATE ORDER (FIXED)
  // ==========================
  static async createOrder(
    customerId: string,
    listingId: string,
    quantity: number
  ) {
    return prisma.$transaction(async (tx) => {
      const listing = await tx.listing.findUnique({
        where: { id: listingId },
        include: {
          productType: true,
        },
      });

      if (!listing) throw new Error("Listing not found");

      const availableQty = new Prisma.Decimal(listing.quantity);
      const reqQty = new Prisma.Decimal(quantity);

      if (reqQty.greaterThan(availableQty)) {
        throw new Error("Insufficient quantity available");
      }

      const order = await tx.order.create({
        data: {
          customerId,
          farmerId: listing.farmerId,
          listingId,
          quantity: reqQty,
          unitPrice: listing.pricePerKg,
          totalPrice: reqQty.mul(listing.pricePerKg),
          status: OrderStatus.pending,
        },
      });

      return order;
    });
  }

  // ==========================
  // GET CUSTOMER ORDERS
  // ==========================
  static async getOrdersByCustomer(
    customerId: string,
    status?: OrderStatus,
    query?: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    return prisma.order.findMany({
      where: {
        customerId,

        ...(status && { status }),

        ...(query && {
          OR: [
            {
              listing: {
                productType: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
            },
            {
              listing: {
                description: { contains: query, mode: "insensitive" },
              },
            },
          ],
        }),
      },

      skip: (page - 1) * pageSize,
      take: pageSize,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        listing: {
          include: {
            productType: true,
          },
        },
        farmer: true,
      },
    });
  }
}