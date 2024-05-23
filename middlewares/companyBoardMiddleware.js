import { APIError } from "../exceptions/APIError.js";
import { UserCompanyModel } from "../models/UserCompanyModel.js";
import { BoardModel } from "../models/BoardModel.js";

export const companyBoardMiddleware = async function (req, res, next) {
    try {
        const user = req.user;
        const boardId = req.params.id;

        const board = await BoardModel.findById(boardId);
        const companyId = board.companyId;
        
        const userCompany = await UserCompanyModel.findOne({
            userId: user.id,
            companyId,
        });

        if (!userCompany) {
            return next(APIError.BadRequest("Нет доступа"));
        }

        req.userCompany = userCompany;
        next();
    } catch (e) {
        return next(APIError.BadRequest("Нет доступа"));
    }
};
