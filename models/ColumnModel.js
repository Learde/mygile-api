import { Schema, model } from "mongoose";

const ColumnSchema = new Schema({
    title: { type: String, required: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    position: { type: Number, required: true },
});

const ColumnModel = model("Column", ColumnSchema);

export { ColumnModel, ColumnSchema };
