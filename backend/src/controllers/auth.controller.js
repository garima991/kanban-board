import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { validateSignUpData } from "../utils/validate.js";

// Generate tokens
const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

/**
 * @desc register a new user
 * @route POST /auth/signup
 * @access Public
 */

export const registerUser = async (req, res) => {
  try {
    const { name, email, username, password, confirmPassword } = req.body;

    // validate the signup data
    const { isValid, errors } = validateSignUpData({  name, username, email, password, confirmPassword  });

    if (!isValid) {
      return res.status(400).json({ success: false, errors });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
   
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    
    const user = await User.create({
      name,
      email,
      username: username.toLowerCase(),
      password,
    });

    const { accessToken, refreshToken } = await generateTokens(user);

    const cleanUser = await User.findById(user._id).select("-password -refreshToken");

    res
      .status(201)
      .cookie("accessToken", accessToken, { httpOnly: true, sameSite : "none", secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, sameSite : "none", secure: true })
      .json({message: 'User registered successfully !', user: cleanUser, accessToken, refreshToken });
  }
   catch (error) {
    res.status(500).json({ message: "Error while registering user" , error: error.message});
  }
};


/**
 * @desc Login a user
 * @route POST /auth/login
 * @access Public
 */

export const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email && !username) {
      return res.status(400).json({ error: "Email or username is required" });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    const cleanUser = await User.findById(user._id).select("-password -refreshToken");

    res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, sameSite : "none", secure: true})
      .cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "none", secure: true })
      .json({message: 'User logged in successfully', user: cleanUser, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Login failed" , error: error.message});
  }
};


/**
 * @desc    Log out a user
 * @route   POST /auth/logout
 * @access  Private
 */

export const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    res.clearCookie("accessToken").clearCookie("refreshToken").json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" , error: error.message});
  }
};


/**
 * @desc    Refresh access token using valid refresh token
 * @route   POST /auth/refresh
 * @access  Public
 */

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res
      .cookie("accessToken", accessToken, { httpOnly: true, sameSite : "none", secure: true})
      .cookie("refreshToken", refreshToken, { httpOnly: true, sameSite : "none", secure: true })
      .json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Failed to refresh token" , error: error.message});
  }
};


/**
 * @desc    Update user's password
 * @route   PUT /auth/update-password
 * @access  Private
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
    res.status(500).json({ message: "Password update failed" , error: error.message});
  }
};


/**
 * @desc    Update user's account details
 * @route   PUT /auth/update-account-details
 * @access  Private
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
    res.status(500).json({ message: "Update failed" , error: error.message});
  }
};


/**
 * @desc    Delete user's account
 * @route   DELETE /auth/delete-account
 * @access  Private
 */

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" , error: error.message});
  }
};
