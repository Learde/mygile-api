import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { UserModel } from "../models/UserModel.js";
import { UserDTO } from "../dtos/UserDTO.js";
import { APIError } from "../exceptions/APIError.js";
import { getRandomAvatarColor } from "../utils/avatarColors.js";

import { mailService } from "./mailService.js";
import { tokenService } from "./tokenService.js";

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw APIError.BadRequest(
                `Пользователь с такой почтой уже существует`,
            );
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuidv4(); // v34fa-asfasf-142saf-sa-asf

        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink,
            role: "USER",
            avatarColor: getRandomAvatarColor(),
        });
        // await mailService.sendActivationMail(
        //     email,
        //     `${process.env.API_URL}/api/activate/${activationLink}`,
        // );

        const userDto = new UserDTO(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw APIError.BadRequest("Неккоректная ссылка активации");
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw APIError.BadRequest("Пользователь с таким email не найден");
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw APIError.BadRequest("Неверный пароль");
        }
        const userDto = new UserDTO(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw APIError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw APIError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDTO(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }

    async getById(id) {
        const user = await UserModel.findById(id);
        return user;
    }

    async getAll() {
        const users = await UserModel.find();
        return users;
    }
}

export const userService = new UserService();
