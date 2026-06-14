import {
  Request,
  Response,
} from "express";

import { AuthService } from "../service/auth.service";

import {
  setRefreshCookie,
  clearRefreshCookie,
} from "../utils/cookies";

export class AuthController {
  static async register(
    req: Request,
    res: Response
  ) {
    const result =
      await AuthService.register(
        req.body
      );

    setRefreshCookie(
      res,
      result.refreshToken
    );

    return res.status(201).json({
      success: true,

      accessToken:
        result.accessToken,

      user: result.user,
    });
  }

  static async login(
    req: Request,
    res: Response
  ) {
    const result =
      await AuthService.login(
        req.body
      );

    setRefreshCookie(
      res,
      result.refreshToken
    );

    return res.json({
      success: true,

      accessToken:
        result.accessToken,

      user: result.user,
    });
  }

  static async me(
  req: Request,
  res: Response
) {
  const profile =
    await AuthService.getProfile(
      req.user!.userId
    );

  return res.json({
    success: true,
    data: profile,
  });
}

  static async logout(
    req: Request,
    res: Response
  ) {
    const token =
      req.cookies
        ?.refreshToken;

    if (token) {
      await AuthService.logout(
        token
      );
    }

    clearRefreshCookie(
      res
    );

    return res.json({
      success: true,
      message:
        "Logged out successfully",
    });
  }

  static async refresh(
    req: Request,
    res: Response
  ) {
    const token =
      req.cookies
        ?.refreshToken;

    if (!token) {
      return res.status(401).json({
        message:
          "Refresh token missing",
      });
    }

    const result =
      await AuthService.refreshToken(
        token
      );

    setRefreshCookie(
      res,
      result.refreshToken
    );

    return res.json({
      accessToken:
        result.accessToken,
    });
  }
}