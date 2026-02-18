import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { registerUserService, loginUserService } from "../../services/auth.service";
import { UserModel, UserRole } from "../../models/user.model";

jest.mock("../../models/user.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  const mockUser = {
    _id: "user123",
    email: "test@example.com",
    password: "hashedpassword",
    role: UserRole.USER,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
  });

  describe("registerUserService", () => {
    it("should hash password and create user", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await registerUserService(
        "test@example.com",
        "plainpassword",
        UserRole.USER,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith("plainpassword", 10);
      expect(UserModel.create).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "hashedpassword",
        role: UserRole.USER,
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe("loginUserService", () => {
    it("should return token for valid credentials", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockedToken");

      const token = await loginUserService(
        "test@example.com",
        "plainpassword",
      );

      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "plainpassword",
        mockUser.password,
      );

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userid: mockUser._id,
          role: mockUser.role,
        },
        "testsecret",
        { expiresIn: "1h" },
      );

      expect(token).toBe("mockedToken");
    });

    it("should throw error if user not found", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        loginUserService("wrong@test.com", "pass"),
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error if password invalid", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        loginUserService("test@example.com", "wrongpass"),
      ).rejects.toThrow("Invalid email or password");
    });
  });
});
