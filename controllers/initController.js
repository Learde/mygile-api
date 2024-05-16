import { userService } from "../service/userService.js";
import { APIError } from "../exceptions/APIError.js";

class InitController {
    async init(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return next(APIError.BadRequest("Пользователь не найден"));
            }

            const user = await userService.getById(userId);
            if (!user) {
                return next(APIError.BadRequest("Пользователь не найден"));
            }
            user.password = undefined;
            user.activationLink = undefined;

            return res.json({ user });
        } catch (e) {
            next(e);
        }
    }
}

export const initController = new InitController();
