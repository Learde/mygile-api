import { boardService } from "../service/boardService.js";
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
}

export const boardController = new BoardController();
