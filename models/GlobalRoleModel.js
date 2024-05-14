import { Schema, model } from "mongoose";

const GlobalRoleSchema = new Schema({
    value: { type: String, unique: true, default: "USER" },
});

const GlobalRoleModel = model("GlobalRole", GlobalRoleSchema);

export { GlobalRoleSchema, GlobalRoleModel };
