import { companyService } from "../service/companyService.js";
import { APIError } from "../exceptions/APIError.js";

class CompanyController {
    async add(req, res, next) {
        try {
            const { title } = req.body;
            const companyData = await companyService.add(title, req.user);

            return res.json(companyData);
        } catch (e) {
            next(e);
        }
    }

    async getUserCompanies(req, res, next) {
        try {
            const companies = await companyService.getAll(req.user, req.query.search);

            return res.json(companies);
        } catch (e) {
            next(e);
        }
    }

    async getCompany(req, res, next) {
        try {
            const { id } = req.params;
            const company = await companyService.getById(id, req.user);

            return res.json(company);
        } catch (e) {
            next(e);
        }
    }

    async editCompany(req, res, next) {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const company = await companyService.edit(id, title, req.user);

            return res.json(company);
        } catch (e) {
            next(e);
        }
    }

    async deleteCompany(req, res, next) {
        try {
            const { id } = req.params;
            const company = await companyService.delete(id, req.user);

            return res.json(company);
        } catch (e) {
            next(e);
        }
    }

    async addUserToCompany(req, res, next) {
        try {
            const { email, companyId } = req.body;
            const company = await companyService.addUserToCompany(companyId, email, req.user);

            return res.json(company);
        } catch (e) {
            next(e);
        }
    }
    
    async deleteUserFromCompany(req, res, next) {
        try {
            const { userId, companyId } = req.query;
            const company = await companyService.deleteUserFromCompany(companyId, userId, req.user);

            return res.json(company);
        } catch (e) {
            next(e);
        }
    }

    async updateUserCompanyRole(req, res, next) {
        try {
            const { userId, companyId, role } = req.body;
            const company = await companyService.updateUserCompanyRole(companyId, userId, role, req.user);

            return res.json(company);
        } catch (e) {
            next(e);
        }
    }
}

export const companyController = new CompanyController();
