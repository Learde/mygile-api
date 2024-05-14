import { globalRoleService } from "../service/globalRoleService.js";
import { APIError } from "../exceptions/APIError.js";

class GlobalRoleController {
    async add(req, res, next) {
        try {
            const { value } = req.body;
            const roleData = await globalRoleService.add(value);

            return res.json(roleData);
        } catch (e) {
            next(e);
        }
    }

    async getRoles(req, res, next) {
        try {
            const roles = await globalRoleService.getAll();
            return res.json(roles);
        } catch (e) {
            next(e);
        }
    }
}

export const globalRoleController = new GlobalRoleController();
