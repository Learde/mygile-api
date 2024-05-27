import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
    title: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const ChatModel = model("Chat", ChatSchema);

export { ChatSchema, ChatModel };
