import { Schema, model } from "mongoose";

const CompanySchema = new Schema({
    title: { type: String, required: true },
});

const CompanyModel = model("Company", CompanySchema);

export { CompanySchema, CompanyModel };
