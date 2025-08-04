const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = (req, res, next) => {
  try {
    if (req.session.token) {
      const token = req.session.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to request
      return next(); // Proceed to protected route
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};
