import { Request, Response } from "express";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";


export const registerUser = async (req: Request, res: Response) => {
  try {
    let { email, password, role } = req.body;
    email = email.trim().toLowerCase();
    const user = await registerUserService(email, password, role);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    const token = await loginUserService(email, password);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = (req: AuthRequest, res: Response) => {
  res.status(200).json({
      userId: req.user?.userId,
      role: req.user?.role,
  });
}
