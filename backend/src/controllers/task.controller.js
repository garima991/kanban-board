import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

/*
@desc Generate access and refresh tokens for a user
*/
const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

/*
@desc Register a new user
@route POST /api/v1/auth/register
@access Public
*/
const registerUser = async (req, res) => {
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

/** 
@desc Login existing user
@route POST /api/v1/auth/login
@access Public
*/
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

/** 
@desc Logout user and clear tokens
@route POST /api/v1/auth/logout
@access Private
*/

export const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};

/** 
@desc Refresh access token using refresh token
@route POST /api/v1/auth/refresh-token
@access Public
*/

export const refreshAccessToken = async (req, res) => {
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

/** 
@desc Get details of currently logged-in user
@route GET /api/v1/auth/me
@access Private
*/

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};


/** 
@desc Change password of logged-in user
@route PATCH /api/v1/auth/change-password
@access Private
*/

export const changePassword = async (req, res) => {
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


/** 
@desc Update full name or email of user
@route PATCH /api/v1/auth/update-profile
@access Private
*/

export const updateAccountDetails = async (req, res) => {
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
