import express from "express";
import { body } from "express-validator";

import { userController } from "../controllers/userController.js";
import { globalRoleController } from "../controllers/globalRoleController.js";
import { initController} from "../controllers/initController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// auth
router.post(
    "/auth/register",
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }

        return true;
    }),
    userController.registration,
);
router.post("/auth/login", userController.login);
router.post("/auth/logout", userController.logout);
router.get("/auth/activate/:link", userController.activate);
router.get("/auth/refresh", userController.refresh);

// users
router.get("/users", authMiddleware, userController.getUsers);
router.get("/users/:id", authMiddleware, userController.getUser);

// roles
// router.post("/roles", globalRoleController.add);
// router.get("/roles", globalRoleController.getRoles);

// init
router.get("/init", authMiddleware, initController.init);

export { router };
