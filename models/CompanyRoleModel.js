import { Schema, model } from "mongoose";

const CompanyRoleSchema = new Schema({
    value: { type: String, unique: true },
    title: { type: String },
});

const CompanyRoleModel = model("CompanyRole", CompanyRoleSchema);

export { CompanyRoleSchema, CompanyRoleModel };
