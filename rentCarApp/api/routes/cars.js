const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuthorization");
const CarsController = require("../controlers/cars");

router.get(
  "/",
  (req, res, next) =>
    checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
  CarsController.cars_get_all
);

router.post(
  "/",
  (req, res, next) => checkAuth(req, res, next, ["ADMIN"]),
  CarsController.cars_create_car
);

router.get(
  "/:carId",
  (req, res, next) =>
    checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
  CarsController.cars_get_car
);

router.put(
  "/:carId",
  (req, res, next) => checkAuth(req, res, next, ["ADMIN"]),
  CarsController.cars_update_car
);

router.delete(
  "/:carId",
  (req, res, next) => checkAuth(req, res, next, ["ADMIN"]),
  CarsController.cars_delete
);

router.get(
  "/search/:key",
  (req, res, next) =>
    checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
  CarsController.car_search
);

module.exports = router;

// (req, res, next) => checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
