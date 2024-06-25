import { boardService } from "../service/boardService.js";
import { columnService } from "../service/columnService.js";
import { taskService } from "../service/taskService.js";
import { chatService } from "../service/chatService.js";
import { APIError } from "../exceptions/APIError.js";

class BoardController {
    async add(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const { title, type } = req.body;
            const companyData = await boardService.add(title, type, companyId, req.user);

            return res.json(companyData);
        } catch (e) {
            next(e);
        }
    }

    async getCompanyBoards(req, res, next) {
        try {
            const companyId = req.params.companyId;
            const boards = await boardService.getAll(companyId, req.user);

            return res.json(boards);
        } catch (e) {
            next(e);
        }
    }

    async getMembers(req, res, next) {
        try {
            const { id } = req.params;
            const members = await boardService.getMembers(id);

            return res.json(members);
        } catch (e) {
            next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const board = await boardService.edit(id, title, req.userCompany, req.user);

            return res.json(board);
        } catch (e) {
            next(e);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const board = await boardService.getById(id, req.userCompany, req.user);

            return res.json(board);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const board = await boardService.deleteById(id, req.userCompany, req.user);

            return res.json(board);
        } catch (e) {
            next(e);
        }
    }

    async addColumn(req, res, next) {
        try {
            const { id } = req.params;
            const { title } = req.body;
            const column = await columnService.add(title, id, req.userCompany);

            return res.json(column);
        } catch (e) {
            next(e);
        }
    }

    async editColumn(req, res, next) {
        try {
            const { id, columnId } = req.params;
            const { title } = req.body;
            const column = await columnService.edit(title, columnId, id, req.userCompany);

            return res.json(column);
        } catch (e) {
            next(e);
        }
    }

    async deleteColumn(req, res, next) {
        try {
            const { id, columnId } = req.params;
            const column = await columnService.delete(columnId, req.userCompany);

            return res.json(column);
        } catch (e) {
            next(e);
        }
    }

    async moveColumn(req, res, next) {
        try {
            const { columnId } = req.params;
            const { position } = req.body;
            const column = await columnService.moveColumn(columnId, position, req.userCompany);

            return res.json(column);
        } catch (e) {
            next(e);
        }
    }

    async addTask(req, res, next) {
        try {
            const { columnId, id } = req.params;
            const task = await taskService.add(req.body, columnId, id, req.user);

            return res.json(task);
        } catch (e) {
            next(e);
        }
    }

    async getTask(req, res, next) {
        try {
            const { taskId } = req.params;
            const task = await taskService.get(taskId);

            return res.json(task);
        } catch (e) {
            next(e);
        }
    }

    async moveTask(req, res, next) {
        try {
            const { taskId, id, columnId } = req.params;
            const { position } = req.body;
            const task = await taskService.moveTask(taskId, position, columnId);

            return res.json(task);
        } catch (e) {
            next(e);
        }
    }

    async editTask(req, res, next) {
        try {
            const { taskId } = req.params;
            const task = await taskService.edit(req.body, taskId, req.userCompany, req.user);

            return res.json(task);
        } catch (e) {
            next(e);
        }
    }

    async addMessage(req, res, next) {
        try {
            const { chatId } = req.params;
            const { text, authorId } = req.body;
            const message = await chatService.addMessage({ chatId, text, authorId });

            return res.json(message);
        } catch (e) {
            next(e);
        }
    }
}

export const boardController = new BoardController();
