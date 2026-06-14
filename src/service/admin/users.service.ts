import { prisma } from "../../lib/prisma";
import { Role } from "../../constants/role";

export class UsersService {
  async getAllUsers(
    role?: Role,
    page = 1,
    pageSize = 10,
    search?: string,
    productTypeId?: string
  ) {
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (
      role === Role.farmer &&
      productTypeId
    ) {
      where.farmerListings = {
        some: {
          productTypeId,
        },
      };
    }

    const [users, total] =
      await Promise.all([
        prisma.user.findMany({
          where,

          skip:
            (page - 1) * pageSize,

          take: pageSize,

          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            region: true,
            role: true,
            status: true,
            createdAt: true,

            farmerListings: {
              select: {
                id: true,
                quantity: true,
                unit: true,
                pricePerKg: true,
                status: true,
                description: true,

                productType: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),

        prisma.user.count({
          where,
        }),
      ]);

    return {
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(
          total / pageSize
        ),
      },
    };
  }

  async getUserById(
    userId?: string
  ) {

    if (!userId) {
      throw new Error(
        "User ID is required"
      );
    }
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          region: true,
          role: true,
          status: true,
          createdAt: true,

          farmerListings: {
            select: {
              id: true,
              quantity: true,
              unit: true,
              pricePerKg: true,
              status: true,
              description: true,
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

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    return user;
  }
}