import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Generate tokens
const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      username: username.toLowerCase(),
      password,
    });

    const { accessToken, refreshToken } = await generateTokens(user);

    const cleanUser = await User.findById(user._id).select("-password -refreshToken");

    res
      .status(201)
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .json({ user: cleanUser, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error while registering user" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email && !username) {
      return res.status(400).json({ message: "Email or username is required" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    const cleanUser = await User.findById(user._id).select("-password -refreshToken");

    res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .json({ user: cleanUser, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res.clearCookie("accessToken").clearCookie("refreshToken").json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

// Refresh Access Token
const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Failed to refresh token" });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.isPasswordCorrect(oldPassword);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password update failed" });
  }
};

// Update Account Details
const updateAccountDetails = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email },
      { new: true }
    ).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
