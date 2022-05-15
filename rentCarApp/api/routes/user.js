const express = require("express");
const router = express.Router();
const UserController = require("../controlers/user");
const checkAuth = require("../middleware/checkAuthorization");

// router.post("/signup", UserController.user_signup);    First Version (SignUp / Register )

router.post("/login", UserController.user_login);

router.delete(
  "/:userId",
  (req, res, next) => checkAuth(req, res, next, ["ADMIN"]),
  UserController.user_delete
);

router.post("/register", UserController.user_register); // *WORKING* Second Version (SignUp / Register )

router.get("/verify/:_id/:token", UserController.verifyEmail);

router.post(
  "/forgotpassword",
  (req, res, next) =>
    checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
  UserController.forgotPassword
);

router.put(
  "/changepassword/:email",
  (req, res, next) =>
    checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
  UserController.changePassword
);

module.exports = router;
