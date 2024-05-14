import express from "express";
import { body } from "express-validator";

import { userController } from "../controllers/userController.js";
import { globalRoleController } from "../controllers/globalRoleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// auth
router.post(
    "/auth/registration",
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    userController.registration,
);
router.post("/auth/login", userController.login);
router.post("/auth/logout", userController.logout);
router.get("/auth/activate/:link", userController.activate);
router.get("/auth/refresh", userController.refresh);

// users
router.get("/users", authMiddleware, userController.getUsers);

// roles
// router.post("/roles", globalRoleController.add);
// router.get("/roles", globalRoleController.getRoles);

export { router };
