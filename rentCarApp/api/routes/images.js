const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/checkAuthorization");
const ImageController = require("../controlers/images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/", ImageController.image_get_all);

router.post(
  "/",
  upload.single("carImage"),
  ImageController.images_upload_image
);

router.get(
  "/:imageId",
  (req, res, next) =>
    checkAuth(req, res, next, ["ADMIN", "EMPLOYEE", "CLIENT"]),
  ImageController.images_get_image
);

router.delete(
  "/:imageId",
  (req, res, next) => checkAuth(req, res, next, ["ADMIN", "EMPLOYEE"]),
  ImageController.images_delete
);

module.exports = router;
