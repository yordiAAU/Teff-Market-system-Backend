import { prisma } from "../lib/prisma";

import {
  comparePassword,
  hashPassword,
} from "../utils/password";

import {
  createAuthTokens,
} from "../utils/auth-response";

import {
  getRefreshExpiryDate,
} from "../utils/token-expiry";

import {
  RegisterInput,
  LoginInput,
} from "../validation/auth.validation";


import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";


export class AuthService {
  
static async refreshToken(
  oldToken: string
) {
  const storedToken =
    await prisma.refreshToken.findFirst({
      where: {
        token: oldToken,
        revoked: false,
      },
      include: {
        user: true,
      },
    });

  if (!storedToken) {
    throw new Error(
      "Invalid refresh token"
    );
  }

  if (
    storedToken.expiresAt <
    new Date()
  ) {
    throw new Error(
      "Refresh token expired"
    );
  }

  verifyRefreshToken(
    oldToken
  );

  await prisma.refreshToken.update({
    where: {
      id: storedToken.id,
    },
    data: {
      revoked: true,
    },
  });

  const payload = {
    userId:
      storedToken.user.id,

    email:
      storedToken.user.email,

    role:
      storedToken.user.role,
  };

  const accessToken =
    generateAccessToken(
      payload
    );

  const refreshToken =
    generateRefreshToken(
      payload
    );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,

      userId:
        storedToken.user.id,

      expiresAt:
        getRefreshExpiryDate(),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
}

  static async register(
    data: RegisterInput
  ) {
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

    if (existingUser) {
      throw new Error(
        "Email already exists"
      );
    }

    const passwordHash =
      await hashPassword(
        data.password
      );

    const user =
      await prisma.user.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          passwordHash,
          role: data.role,
          phone: data.phoneNumber,
          region: data.region,
        },
      });

    const tokens =
      createAuthTokens(user);

    await prisma.refreshToken.create({
      data: {
        token:
          tokens.refreshToken,

        userId: user.id,

        expiresAt:
          getRefreshExpiryDate(),
      },
    });

    return {
      user,
      ...tokens,
    };
  }

  static async login(
    data: LoginInput
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

    if (!user) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const validPassword =
      await comparePassword(
        data.password,
        user.passwordHash
      );

    if (!validPassword) {
      throw new Error(
        "Invalid credentials"
      );
    }

    const tokens =
      createAuthTokens(user);

    await prisma.refreshToken.create({
      data: {
        token:
          tokens.refreshToken,

        userId: user.id,

        expiresAt:
          getRefreshExpiryDate(),
      },
    });

    return {
      user,
      ...tokens,
    };
  }

  static async logout(
    refreshToken: string
  ) {
    await prisma.refreshToken.updateMany({
      where: {
        token: refreshToken,
      },
      data: {
        revoked: true,
      },
    });
  }

  static async getProfile(
  userId: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phone: true,
        region: true,
        createdAt: true,
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