import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel, UserRole } from "../models/user.model";

export const registerUserService = async (
  email: string,
  password: string,
  role?: UserRole,
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    email,
    password: hashedPassword,
    role: role as UserRole,
  });

  return user;
};

export const loginUserService = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  console.log("Incoming email:", email);
  console.log("Type:", typeof email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userid: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  return token;
};
