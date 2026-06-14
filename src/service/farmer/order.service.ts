import { prisma } from "../../lib/prisma";
import { ListingStatus, OrderStatus } from "@prisma/client";


import { Prisma } from "@prisma/client";




export class OrderService {
  // ✅ GET FARMER ORDERS (filter + search + status)

  // ✅ GET FARMER ORDERS (filter + search + status + pagination + count)
  static async getOrdersByFarmer(
    farmerId: string,
    query?: string,
    status?: OrderStatus,
    page: number = 1,
    pageSize: number = 10
  ) {
    // Build base where clause
    const where: Prisma.OrderWhereInput = {
      farmerId,
      ...(status && { status }),
    };

    // Add search filter if query is provided
    if (query) {
      where.AND = {
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
      };
    }

    // Run both queries in a transaction for consistency
    const [orders, totalCount] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          listing: {
            include: {
              productType: true,
            },
          },
          customer: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }


  

  // ✅ UPDATE ORDER STATUS (CORE LOGIC FIXED)
  static async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { listing: true },
      });

      if (!order) throw new Error("Order not found");

      const oldStatus = order.status;

      // 🟡 If already same status → ignore
      if (oldStatus === newStatus) return order;

      // ==============================
      // 1. COMPLETED → reduce stock
      // ==============================
      if (newStatus === OrderStatus.completed) {
        await tx.listing.update({
          where: { id: order.listingId },
          data: {
            quantity: {
              decrement: order.quantity,
            },
          },
        });
      }

      // ==============================
      // 2. CANCELLED → refund stock
      // (ONLY if it was completed before)
      // ==============================
      if (
        newStatus === OrderStatus.cancelled &&
        oldStatus === OrderStatus.completed
      ) {
        await tx.listing.update({
          where: { id: order.listingId },
          data: {
            quantity: {
              increment: order.quantity,
            },
          },
        });
      }

      // ==============================
      // 3. update order
      // ==============================
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });

      // ==============================
      // 4. update listing status (LOW STOCK LOGIC FIXED)
      // ==============================
      const listing = await tx.listing.findUnique({
        where: { id: order.listingId },
      });

      if (listing) {
        const qty = new Prisma.Decimal(listing.quantity);

        await tx.listing.update({
          where: { id: listing.id },
          data: {
            status:
              qty.lessThanOrEqualTo(5)
                ? ListingStatus.inactive
                : ListingStatus.active,
          },
        });
      }

      return updatedOrder;
    });
  }
}