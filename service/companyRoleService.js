import { CompanyRoleModel } from "../models/CompanyRoleModel.js";

class CompanyRoleService {
    async add(value, title) {
        const role = await CompanyRoleModel.create({
            value,
            title,
        });

        return role;
    }

    async getAll() {
        const roles = await CompanyRoleModel.find();
        return roles;
    }
}

export const companyRoleService = new CompanyRoleService();
