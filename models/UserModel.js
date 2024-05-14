import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String },
    surname: { type: String },
    avatar: { type: String },
    avatarColor: { type: String },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    role: { type: String, ref: "GlobalRole", required: true },
});

const UserModel = model("User", UserSchema);

export { UserSchema, UserModel };
