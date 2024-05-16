import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, default: "" },
    surname: { type: String, default: "" },
    avatar: { type: String, default: "" },
    avatarColor: { type: String, default: "" },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    role: { type: String, ref: "GlobalRole", required: true },
});

const UserModel = model("User", UserSchema);

export { UserSchema, UserModel };
