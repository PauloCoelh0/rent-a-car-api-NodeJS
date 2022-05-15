const mongoose = require("mongoose");
const Car = require("../models/car");

exports.cars_get_all = (req, res, next) => {
  Car.find()
    .select(
      "_id carType brand model seatingCapacity numDoors transmisson rentPricePerDay"
    )
    .exec()
    .then((docs) => {
      const response = {
        numberOfCars: docs.length,
        allCreatedCars: docs.map((doc) => {
          return {
            carId: doc._id,
            carType: doc.carType,
            brand: doc.brand,
            model: doc.model,
            seatingCapacity: doc.seatingCapacity,
            numDoors: doc.numDoors,
            transmisson: doc.transmisson,
            rentPricePerDay: doc.rentPricePerDay,
            request: {
              type: "GET",
              url: "http://localhost:3200/stand/cars/" + doc._id,
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.cars_create_car = (req, res, next) => {
  const car = new Car({
    _id: new mongoose.Types.ObjectId(),
    carType: req.body.carType,
    brand: req.body.brand,
    model: req.body.model,
    seatingCapacity: req.body.seatingCapacity,
    numDoors: req.body.numDoors,
    transmisson: req.body.transmisson,
    rentPricePerDay: req.body.rentPricePerDay,
  });
  car
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "CAR SUCCESSFULLY CREATED",
        createdCar: {
          carId: result._id,
          carType: result.carType,
          brand: result.brand,
          model: result.model,
          seatingCapacity: result.seatingCapacity,
          numDoors: result.numDoors,
          transmisson: result.transmisson,
          rentPricePerDay: result.rentPricePerDay,
          request: {
            type: "GET",
            url: "http://localhost:3200/stand/cars/" + result._id,
          },
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

exports.cars_get_car = (req, res, next) => {
  const id = req.params.carId;
  Car.findById(id)
    .select(
      "_id carType brand model seatingCapacity numDoors transmisson rentPricePerDay"
    )
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          carDetails: {
            carId: doc._id,
            carType: doc.carType,
            brand: doc.brand,
            model: doc.model,
            seatingCapacity: doc.seatingCapacity,
            numDoors: doc.numDoors,
            transmisson: doc.transmisson,
            rentPricePerDay: doc.rentPricePerDay,
          },
          request: {
            type: "GET",
            description: "GET ALL CARS LIST",
            url: "http://localhost:3200/stand/cars",
          },
        });
      } else {
        res.status(404).json({ message: "INVALID CAR ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.cars_update_car = (req, res, next) => {
  const id = req.params.carId;
  const body = req.body;
  Car.findByIdAndUpdate(id, body)
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "CAR SUCCESSFULLY UPDATED",
        request: {
          type: "GET",
          url: "http://localhost:3200/stand/cars/" + id,
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

exports.cars_delete = (req, res, next) => {
  const id = req.params.carId;
  Car.findByIdAndRemove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        mesage: "CAR SUCCESSFULLY DELETED",
        request: {
          type: "GET",
          description: "GET ALL CARS LIST",
          url: "http://localhost:3200/stand/cars",
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

exports.car_search = async (req, res) => {
  let data = await Car.find({
    $or: [
      { brand: { $regex: req.params.key } },
      { carType: { $regex: req.params.key } },
      { model: { $regex: req.params.key } },
    ],
  });
  res.send(data);
};
