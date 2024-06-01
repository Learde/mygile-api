import { Schema, model } from "mongoose";

const BoardSchema = new Schema({
    title: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    type: { type: String, required: true },
    backlogId: { type: Schema.Types.ObjectId, ref: "Column" },
    sprints: [{ type: Object, default: [] }],
});

const BoardModel = model("Board", BoardSchema);

export { BoardSchema, BoardModel };
