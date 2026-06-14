import {
  Request,
  Response,
} from "express";

import { UsersService } from "../../service/admin/users.service";


const usersService =
  new UsersService();

export class UsersController {
  async getUsers(
    req: Request,
    res: Response
  ) {
    const {
      page,
      pageSize,
      role,
      search,
      productTypeId,
    } = req.query as any;

    const result =
      await usersService.getAllUsers(
        role,
        Number(page || 1),
        Number(pageSize || 10),
        search,
        productTypeId
      );

    return res.json({
      success: true,
      data: result,
    });
  }

  async getUser(
    req: Request,
    res: Response
  ) {

   const{ id } = req.params ;

      if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Invalid order id",
    });
  }

        

    const result =
      await usersService.getUserById(
        id
      );

    return res.json({
      success: true,
      data: result,
    });
  }
}