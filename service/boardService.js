import { UserCompanyModel } from "../models/UserCompanyModel.js";
import { BoardModel } from "../models/BoardModel.js";
import { ColumnModel } from "../models/ColumnModel.js";
import { TaskModel } from "../models/TaskModel.js";
import { UserModel } from "../models/UserModel.js";
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

        const board = await BoardModel.create({
            title,
            type,
            companyId,
        });

        if (type?.toUpperCase() === "SCRUM") {
            const column = await ColumnModel.create({
                title: "Хранилище",
                boardId: board._id,
                position: 1,
            });

            board.backlogId = column._id;

            await board.save();
        } else if (type?.toUpperCase() === "KANBAN") {
            const column1 = await ColumnModel.create({
                title: "Запланировано",
                boardId: board._id,
                position: 1,
            });

            const column2 = await ColumnModel.create({
                title: "В работе",
                boardId: board._id,
                position: 2,
            });

            const column3 = await ColumnModel.create({
                title: "Тестирование",
                boardId: board._id,
                position: 3,
            });

            const column4 = await ColumnModel.create({
                title: "Готово",
                boardId: board._id,
                position: 4,
            });
        }

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

    async getMembers(id) {
        const board = await BoardModel.findById(id);
        const members = await UserCompanyModel.find({
            companyId: board.companyId,
        });

        const users = await Promise.all(
            members.map(async (member) => {
                const user = await UserModel.findById(member.userId).select(
                    "-password -activationLink",
                );
                return {
                    role: member.role,
                    user,
                };
            }),
        );

        return users;
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
            throw APIError.BadRequest("Ошибка при получении досок компании");
        }
    }

    async getById(id, userCompany, user) {
        const board = await BoardModel.findById(id);
        const columns = (await ColumnModel.find({ boardId: id })).sort(
            (a, b) => a.position - b.position,
        );
        const columnsWithTasks = await Promise.all(
            columns.map(async (column) => {
                const tasks = await TaskModel.find({
                    columnId: column._id,
                }).sort({ position: 1 });

                const tasksWithMembers = await Promise.all(
                    tasks.map(async (task) => {
                        const membersUsers = await Promise.all(
                            task.members.map(async (memberId) => {
                                const user = await UserModel.findById(memberId).select("-password -activationLink");
                                return user ? user.toObject() : null;
                            }),
                        );

                        // Исключаем null значения, если какой-то пользователь не найден
                        const filteredMembersUsers = membersUsers.filter(
                            (user) => user !== null,
                        );

                        return {
                            ...task.toObject(),
                            membersUsers: filteredMembersUsers,
                        };
                    }),
                );

                return {
                    ...column.toObject(),
                    tasks: tasksWithMembers,
                };
            }),
        );

        return {
            _id: board._id,
            title: board.title,
            type: board.type,
            userRole: userCompany.role,
            companyId: board.companyId,
            columns: columnsWithTasks,
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

    async addSprint(boardId, sprint) {
        const board = await BoardModel.findById(boardId);

        if (
            !userCompany ||
            !(userCompany.role === "ADMIN" || userCompany.role === "MANAGER") ||
            !board
        ) {
            throw APIError.BadRequest(
                "Доска не найдена или нет прав создание спринта",
            );
        }

        board.sprints.unshift(sprint);
        await board.save();
    }
}

export const boardService = new BoardService();
