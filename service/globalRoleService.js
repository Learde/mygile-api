import { GlobalRoleModel } from "../models/GlobalRoleModel.js";

class GlobalRoleService {
    async add(value) {
        const role = await GlobalRoleModel.create({
            value,
        });

        return role;
    }

    async getAll() {
        const roles = await GlobalRoleModel.find();
        return roles;
    }
}

export const globalRoleService = new GlobalRoleService();
