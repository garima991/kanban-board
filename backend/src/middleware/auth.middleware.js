// validating tokens and authentication

const protect = (req, res, next) => {
    // Set a dummy user for testing
    req.user = { _id: "660d5aaf3b6e2b001f4b5e91" };  // Fake user ID
    next();
  };
  
export default protect;