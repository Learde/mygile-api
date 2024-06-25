import { ChatModel } from "../models/ChatModel.js";
import { MessageModel } from "../models/MessageModel.js";

class ChatService {
    async add({ title }) {
        const chat = await ChatModel.create({ title });

        return chat;
    }

    async addMessage({ chatId, text, authorId }) {
        const createdAt = new Date();

        const message = await MessageModel.create({
            chatId,
            text,
            authorId,
            createdAt,
        });
    }
}

export const chatService = new ChatService();
