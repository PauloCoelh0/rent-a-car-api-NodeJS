const mongoose = require("mongoose");
const Rent = require("../models/rent");
const Car = require("../models/car");
const Image = require("../models/image");

exports.image_get_all = (req, res, next) => {
  Image.find()
    .select("car _id carImage")
    .exec()
    .then((imgs) => {
      res.status(200).json({
        numOfCarImages: imgs.length,
        images: imgs.map((img) => {
          return {
            imageID: img._id,
            car: img.car,
            carImage: img.carImage,
            request: {
              type: "GET",
              url: "http://localhost:3200/stand/images/" + img._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.images_upload_image = (req, res, next) => {
  console.log(req.file);
  Car.findById(req.body.carId)
    .then((car) => {
      const image = new Image({
        _id: mongoose.Types.ObjectId(),
        car: req.body.carId,
        carImage: req.file.path,
      });
      return image.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "IMAGE SUCCESSFULLY UPLOADED",
        ImageCarDetails: {
          _id: result._id,
          car: result.car,
        },
        request: {
          type: "GET",
          url: "http://localhost:3200/stand/images/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.images_get_image = (req, res, next) => {
  Image.findById(req.params.imageId)
    .select("_id car carImage")
    .populate("car", "brand model")
    .exec()
    .then((image) => {
      if (!image) {
        return res.status(404).json({
          message: "IMAGE NOT FOUND",
        });
      }
      res.status(200).json({
        image: image,
        request: {
          type: "GET",
          url: "http://localhost:3200/stand/images",
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.images_delete = (req, res, next) => {
  Image.findByIdAndRemove({ _id: req.params.imageId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "IMAGE SUCCESSFULLY DELETED",
        request: {
          type: "GET",
          url: "http://localhost:3200/stand/images",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
