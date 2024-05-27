import { ChatModel } from "../models/ChatModel.js";

class ChatService {
    async add({ title }) {
        const chat = await ChatModel.create({ title });

        return chat;
    }
}

export const chatService = new ChatService();
