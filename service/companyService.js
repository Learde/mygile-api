import { UserCompanyModel } from "../models/UserCompanyModel.js";
import { CompanyModel } from "../models/CompanyModel.js";
import { UserModel } from "../models/UserModel.js";
import { APIError } from "../exceptions/APIError.js";

class CompanyService {
    async add(title, user) {
        const company = await CompanyModel.create({
            title,
        });
        const userCompany = await UserCompanyModel.create({
            userId: user.id,
            companyId: company._id,
            role: "ADMIN",
        });

        return company;
    }

    async getAll(user, title) {
        try {
            const userId = user.id;

            const userCompanies = await UserCompanyModel.find({
                userId: userId,
            });

            const companyIds = userCompanies.map(
                (userCompany) => userCompany.companyId,
            );

            const query = { _id: { $in: companyIds } };
            if (title) {
                query.title = { $regex: title, $options: "i" };
            }

            const companies = CompanyModel.find(query);

            return companies;
        } catch {
            throw APIError.BadRequest(
                "Ошибка при получении компаний пользователя",
            );
        }
    }

    async getById(id, user) {
        const company = await CompanyModel.findById(id);
        const userCompany = await UserCompanyModel.findOne({
            userId: user.id,
            companyId: id,
        });

        if (!company || !userCompany) {
            throw APIError.BadRequest("Компания не найдена");
        }

        const membersCompany = await UserCompanyModel.find({
            companyId: id,
        });

        console.log(membersCompany);

        const members = await Promise.all(membersCompany.map(async (memberCompany) => {
            const user = await UserModel.findById(memberCompany.userId).select("-password -activationLink");
            return {
                role: memberCompany.role,
                user,
            };
        }));

        console.log(members);

        return {
            _id: company._id,
            title: company.title,
            userRole: userCompany.role,
            members,
        };
    }

    async edit(id, title, user) {
        const userCompany = await UserCompanyModel.findOne({
            userId: user.id,
            companyId: id,
        });

        if (!userCompany || userCompany.role !== "ADMIN") {
            throw APIError.BadRequest(
                "Компания не найдена или нет прав на редактирование",
            );
        }

        const company = await CompanyModel.findByIdAndUpdate(
            id,
            { title },
            {
                new: true,
            },
        );

        return company;
    }

    async delete(id, user) {
        const userCompany = await UserCompanyModel.findOne({
            userId: user.id,
            companyId: id,
        });

        if (!userCompany || userCompany.role !== "ADMIN") {
            throw APIError.BadRequest(
                "Компания не найдена или нет прав на удаление",
            );
        }

        const company = await CompanyModel.findByIdAndDelete(id);

        return company;
    }

    async addUserToCompany(companyId, email, user) {
        const userCompany = await UserCompanyModel.findOne({
            userId: user.id,
            companyId,
        });

        if (!userCompany || userCompany.role !== "ADMIN") {
            throw APIError.BadRequest(
                "Компания не найдена или нет прав на добавление",
            );
        }

        const userToAdd = await UserModel.findOne({ email });
        if (!userToAdd) {
            throw APIError.BadRequest("Добавляемый пользователь не найден");
        }

        const isUserAlreadyInCompany = await UserCompanyModel.findOne({
            userId: userToAdd.id,
            companyId,
        });
        if (isUserAlreadyInCompany) {
            throw APIError.BadRequest("Пользователь уже в компании");
        }

        const companyUser = await UserCompanyModel.create({
            userId: userToAdd._id,
            companyId,
            role: "DEV",
        });

        return companyUser;
    }

    async deleteUserFromCompany(companyId, userId, user) {
        const userCompany = await UserCompanyModel.findOne({
            userId: user.id,
            companyId,
        });

        if (!userCompany || userCompany.role !== "ADMIN") {
            throw APIError.BadRequest(
                "Компания не найдена или нет прав на удаление",
            );
        }

        const isUserAlreadyInCompany = await UserCompanyModel.findOne({
            userId,
            companyId,
        });
        if (!isUserAlreadyInCompany) {
            throw APIError.BadRequest("Пользователь не в компании");
        }

        const companyUser = await UserCompanyModel.findOneAndDelete({
            userId,
            companyId,
        });

        return companyUser;
    }

    async updateUserCompanyRole(companyId, userId, role, user) {
        const userCompany = await UserCompanyModel.findOne({
            userId: user.id,
            companyId,
        });

        if (!userCompany || userCompany.role !== "ADMIN") {
            throw APIError.BadRequest(
                "Компания не найдена или нет прав на редактирование",
            );
        }

        const isUserAlreadyInCompany = await UserCompanyModel.findOne({
            userId,
            companyId,
        });
        if (!isUserAlreadyInCompany) {
            throw APIError.BadRequest("Пользователь не в компании");
        }

        const companyUser = await UserCompanyModel.findOneAndUpdate(
            {
                userId,
                companyId,
            },
            {
                role,
            },
            {
                new: true,
            },
        );

        return companyUser;
    }
}

export const companyService = new CompanyService();
