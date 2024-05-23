import { Schema, model } from "mongoose";

const BoardSchema = new Schema({
    title: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    type: { type: String, required: true },
});

const BoardModel = model("Board", BoardSchema);

export { BoardSchema, BoardModel };
