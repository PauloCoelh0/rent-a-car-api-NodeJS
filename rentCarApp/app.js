const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const carRoutes = require("./api/routes/cars");
const rentRoutes = require("./api/routes/rents");
const imageRoutes = require("./api/routes/images");
const userRoutes = require("./api/routes/user");
const config = require("./config");

mongoose
  .connect(config.db)
  .then(() => console.log("Conection Successful!"))
  .catch((err) => console.error(err));

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Acess-Control-Allow-Origin", "*");
  res.header(
    "Acess-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Acess-Control-Allow-Methods", "PUT, POST, PUT, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routes
app.use("/stand/cars", carRoutes);
app.use("/stand/rent", rentRoutes);
app.use("/stand/images", imageRoutes);
app.use("/user", userRoutes);

//Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
