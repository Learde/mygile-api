import { Schema, model } from "mongoose";

const TaskSchema = new Schema({
    title: { type: String, required: true },
    columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    description: { type: String, default: "" },
    todoList: [{ type: Object, default: [] }],
    position: { type: Number, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    media: [{ type: Object, default: [] }],
    createdAt: { type: Date, default: Date.now },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deadline: { type: Date, default: null },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
    number: { type: Number, default: 0, required: true },
    priority: { type: Object, default: null },
});

const TaskModel = model("Task", TaskSchema);

export { TaskModel, TaskSchema };
