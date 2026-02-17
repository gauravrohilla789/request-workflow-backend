import mongoose from "mongoose";

export enum UserRole{
    USER = "USER",
    ADMIN = "ADMIN"
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER
        }
    },
    { timestamps: true }
)

export const UserModel = mongoose.model("User", userSchema);