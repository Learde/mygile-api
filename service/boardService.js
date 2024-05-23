import { UserCompanyModel } from "../models/UserCompanyModel.js";
import { BoardModel } from "../models/BoardModel.js";
import { APIError } from "../exceptions/APIError.js";

class BoardService {
    async add(title, type, companyId, user) {
        const userCompany = await UserCompanyModel.findOne({
            userId: user.id,
            companyId,
        });

        if (!userCompany || userCompany.role !== "ADMIN") {
            throw APIError.BadRequest(
                "Компания не найдена или нет прав на добавление",
            );
        }

        const board = BoardModel.create({
            title,
            type,
            companyId,
        });

        return board;
    }

    async edit(id, title, userCompany, user) {
        if (!userCompany || userCompany.role !== "ADMIN") {
            throw APIError.BadRequest(
                "Компания не найдена или нет прав на редактирование",
            );
        }

        const board = await BoardModel.findByIdAndUpdate(
            id,
            { title },
            {
                new: true,
            },
        );

        return board;
    }

    async getAll(companyId, user) {
        try {
            const userId = user.id;

            const userCompany = await UserCompanyModel.findOne({
                userId,
                companyId,
            });

            if (!userCompany) {
                throw APIError.BadRequest("Нет доступа к доскам компании");
            }

            const boards = await BoardModel.find({ companyId });

            return boards;
        } catch {
            throw APIError.BadRequest(
                "Ошибка при получении досок компании",
            );
        }
    }

    async getById(id, userCompany, user) {
        const board = await BoardModel.findById(id);

        return {
            _id: board._id,
            title: board.title,
            type: board.type,
            userRole: userCompany.role,
            companyId: board.companyId,
        };
    }

    async delete(id, userCompany, user) {
        const board = await BoardModel.findById(id);

        if (!userCompany || userCompany.role !== "ADMIN" || !board) {
            throw APIError.BadRequest(
                "Доска не найдена или нет прав на удаление",
            );
        }

        const deletedBoard = await BoardModel.findByIdAndDelete(id);

        return deletedBoard;
    }
}

export const boardService = new BoardService();
