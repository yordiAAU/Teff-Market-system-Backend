import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

import { UsersController } from "../../controllers/admin/users.controller";

const adminuserrouter = Router();

const controller =
  new UsersController();

adminuserrouter.get(
  "/",
  authenticate,
  authorize("admin"),
  controller.getUsers.bind(
    controller
  )
);

adminuserrouter.get(
  "/:id",
  authenticate,
  authorize("admin"),
  controller.getUser.bind(
    controller
  )
);

export default adminuserrouter;