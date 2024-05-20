import { companyRoleService } from "../service/companyRoleService.js";
import { APIError } from "../exceptions/APIError.js";

class CompanyRoleController {
    async add(req, res, next) {
        try {
            const { value, title } = req.body;
            const roleData = await companyRoleService.add(value, title);

            return res.json(roleData);
        } catch (e) {
            next(e);
        }
    }

    async getRoles(req, res, next) {
        try {
            const roles = await companyRoleService.getAll();
            return res.json(roles);
        } catch (e) {
            next(e);
        }
    }
}

export const companyRoleController = new CompanyRoleController();
