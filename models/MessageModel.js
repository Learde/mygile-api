import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
    text: { type: String, required: true },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

const MessageModel = model("Message", MessageSchema);

export { MessageSchema, MessageModel };
