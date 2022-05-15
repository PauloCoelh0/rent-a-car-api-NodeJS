const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = (req, res, next, role) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, config.secret);
    console.log(role);
    if (!role.includes(decoded.role.role)) throw new Error("não tem acesso");
    next();
  } catch (error) {
    return res.status(401).json({
      message: "PERMISSION DENIED",
    });
  }
};
