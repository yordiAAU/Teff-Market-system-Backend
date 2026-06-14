import { prisma } from "../../lib/prisma";

export class ProductService {
  static async getAllProducts(
    query?: string,
    page: number = 1,
    pageSize: number = 10
  ) {
    const products = await prisma.productType.findMany({
      where: {
        isActive: true, // ✅ only active products
        ...(query && {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }),
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  }

static async createProduct(data: {
  name: string;
  description: string;
  
},
imageUrls: string[]

) {
  
    const productType = await prisma.productType.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    if (imageUrls.length) {
      await prisma.productTypeImage.createMany({
        data: imageUrls.map((url) => ({
          productTypeId: productType.id,
          imageUrl: url,
        })),
      });
    }

    return prisma.productType.findUnique({
      where: {
        id: productType.id,
      },
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
    });
}

  static async updateProduct(
    id: string,
    data: { name?: string; description?: string }
  ) {
    const product = await prisma.productType.findUnique({
      where: { id },
    });

    if (!product || !product.isActive) {
      throw new Error("Product not found");
    }

    return prisma.productType.update({
      where: { id },
      data: {
        name: data.name ?? product.name,
        description: data.description ?? product.description,
      },
    });
  }

  // ✅ SOFT DELETE (important fix)
  static async deleteProduct(id: string) {
    const product = await prisma.productType.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return prisma.productType.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  static async getProductById(id: string) {
    return prisma.productType.findFirst({
      where: {
        id,
        isActive: true,
      },
    });
  }
}