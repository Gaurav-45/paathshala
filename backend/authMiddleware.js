const jwt = require("jsonwebtoken");
const User = require("./models/userModel");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token:", token); // Log the token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Log the decoded token

      req.user = await User.findById(decoded.id).select("-password");
      console.log("Authenticated User:", req.user); // Log the authenticated user

      next();
    } catch (error) {
      console.error("Not authorized, token failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { generateToken, protect };
