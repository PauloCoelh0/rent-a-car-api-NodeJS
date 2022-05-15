const mongoose = require("mongoose");
const Rent = require("../models/rent");
const Car = require("../models/car");
const nodemailer = require("nodemailer");

//=============Email-Stuff=============//
let mailOptions;
let transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});
const currentUrl = "http://localhost:3200";

exports.rents_get_all = (req, res, next) => {
  Rent.find()
    .select("car collectDate returnDate _id")
    .populate(
      "car",
      "_id carType brand model seatingCapacity numDoors transmisson rentPricePerDay"
    )
    .exec()
    .then((docs) => {
      res.status(200).json({
        numberOfReservations: docs.length,
        rentReservations: docs.map((doc) => {
          return {
            rentId: doc._id,
            collectDate: doc.collectDate,
            returnDate: doc.returnDate,
            carDetails: {
              carId: doc.car._id,
              carType: doc.car.carType,
              brand: doc.car.brand,
              model: doc.car.model,
              seatingCapacity: doc.car.seatingCapacity,
              numDoors: doc.car.numDoors,
              transmisson: doc.car.transmisson,
              rentPricePerDay: doc.car.rentPricePerDay,
            },
            request: {
              type: "GET",
              url: "http://localhost:3200/stand/rent/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.rents_create_rent = async (req, res, next) => {
  try {
    if (req.body.collectDate > req.body.returnDate)
      throw new Error("INVALID DATE");
    await Rent.find({ car: req.body.carId })
      .exec()
      .then((list) => {
        list.forEach((x) => {
          if (
            (new Date(req.body.collectDate) >= x.collectDate &&
              new Date(req.body.collectDate) <= x.returnDate) ||
            (new Date(req.body.returnDate) >= x.collectDate &&
              new Date(req.body.returnDate) <= x.returnDate)
          )
            throw new Error("CAR NOT AVAILABLE ON THIS DATE");
        });
        return;
      });

    await Car.findById(req.body.carId)
      .then((car) => {
        const rent = new Rent({
          _id: mongoose.Types.ObjectId(),
          collectDate: req.body.collectDate,
          returnDate: req.body.returnDate,
          car: req.body.carId,
        });
        return rent.save();
      })
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "CAR RENT RESERVATION SUCCESSFULLY CREATED",
          rentReservation: {
            rentId: result._id,
            carId: result.car,
            collectDate: result.collectDate,
            returnDate: result.returnDate,
          },
          request: {
            type: "GET",
            url: "http://localhost:3200/stand/rent/" + result._id,
          },
        });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rents_get_rent = (req, res, next) => {
  Rent.findById(req.params.rentId)
    .select("_id collectDate returnDate car")
    .populate(
      "car",
      "_id carType brand model seatingCapacity numDoors transmisson rentPricePerDay"
    )
    .exec()
    .then((rent) => {
      if (!rent) {
        return res.status(404).json({
          message: "INVALID RENT ID",
        });
      }
      res.status(200).json({
        rent: rent,
        request: {
          type: "GET",
          url: "http://localhost:3200/stand/rent",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "INVALID RENT ID" });
    });
};

exports.rents_delete_rent = (req, res, next) => {
  Rent.findByIdAndRemove({ _id: req.params.rentId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "CAR RENT RESERVATION SUCCESSFULLY DELETED",
        request: {
          type: "GET",
          url: "http://localhost:3200/stand/rent",
        },
      });
      let transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASS,
        },
      });
      let motivo = req.body.motivo;
      let email = req.body.email;

      let mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Rent-a-Car: [RENT RESERVATION]",
        html: `<p>Your rent reservation has been deleted due to: ${motivo}.</p>`,
      };
      transporter.sendMail(mailOptions);
    });
};

exports.rent_search = async (req, res) => {
  let data = await Rent.find({
    $or: [{ coll: { $regex: req.params.key } }],
  });
  res.send(data);
};
