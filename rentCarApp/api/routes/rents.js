const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuthorization");
const RentsController = require("../controlers/rents");

router.get(
  "/",
  (req, res, next) =>
    checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
  RentsController.rents_get_all
);

router.post(
  "/",
  (req, res, next) =>
    checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
  RentsController.rents_create_rent
);

router.get(
  "/:rentId",
  (req, res, next) =>
    checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
  RentsController.rents_get_rent
);

router.delete(
  "/:rentId",
  (req, res, next) => checkAuth(req, res, next, ["ADMIN", "EMPLOYEE"]),
  RentsController.rents_delete_rent
);

// router.get("/search/:key",(req, res, next) => checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]), RentsController.rent_search);

module.exports = router;
