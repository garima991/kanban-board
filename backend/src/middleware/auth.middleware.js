// validating tokens and authentication

import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    // Get token from cookie or header
    const tokenFromCookie = req.cookies?.accessToken;
    const headerBearerToken = req.headers.authorization ?? "";
    const tokenFromHeader = headerBearerToken?.split("Bearer ")[1] ?? "";
    const token = tokenFromCookie || tokenFromHeader;

    // If token is missing
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token using secret key
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    // Find the user by ID in the database (excluding password and refreshToken)
    const user = await User.findById(decoded?._id).select("-password -refreshToken");

    // If user not found
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Attach user to the request object
    req.user = user;

    // Continue to next middleware or route
    next();
  } 
  catch (error) {
    return res.status(401).json({ message: "Unauthorized: " + (error.message || "Invalid token") });
  }
};








// const protect = (req, res, next) => {
//     // Set a dummy user for testing
//     req.user = { _id: "660d5aaf3b6e2b001f4b5e91" };  // Fake user ID
//     next();
//   };
  
// export default protect;
