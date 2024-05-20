import { Schema, model } from "mongoose";

const UserCompanySchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, ref: "CompanyRole", required: true },
});

const UserCompanyModel = model("UserCompany", UserCompanySchema);

export { UserCompanyModel, UserCompanySchema };
