import express from "express";
import multer from "multer";
import { body } from "express-validator";
import { extname } from "path";

import { userController } from "../controllers/userController.js";
import { globalRoleController } from "../controllers/globalRoleController.js";
import { companyRoleController } from "../controllers/companyRoleController.js";
import { companyController } from "../controllers/companyController.js";
import { initController } from "../controllers/initController.js";

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
router.put("/users/:id", authMiddleware, userController.editUser);

// roles
// router.post("/roles", globalRoleController.add);
// router.get("/roles", globalRoleController.getRoles);

// company roles
// router.post("/company-roles", companyRoleController.add);
router.get("/company-roles", authMiddleware, companyRoleController.getRoles);

// init
router.get("/init", authMiddleware, initController.init);

// company 
router.post("/companies", authMiddleware, companyController.add);
router.get("/companies", authMiddleware, companyController.getUserCompanies);
router.get("/companies/:id", authMiddleware, companyController.getCompany);
router.put("/companies/:id", authMiddleware, companyController.editCompany);
router.delete("/companies/:id", authMiddleware, companyController.deleteCompany);
router.post("/companies/add/user", authMiddleware, companyController.addUserToCompany);
router.delete("/companies/delete/user", authMiddleware, companyController.deleteUserFromCompany);
router.put("/companies/update/user", authMiddleware, companyController.updateUserCompanyRole);

// media
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "media/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), function (req, res) {
    res.send(req.file.filename);
});

export { router };
