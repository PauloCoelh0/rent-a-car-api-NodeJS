const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const config = require("../../config");
const UserService = require("../middleware/service");
require("dotenv").config();
const Users = require("../middleware");

/*email verification*/
let transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});
const saltRounds = 10;
const currentUrl = "http://localhost:3200";

exports.user_login = async (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({ message: "INCORRECT EMAIL" });
      }
      if (!user[0].verified) {
        return res.status(401).json({ message: "USER NAO VERFICADO" });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "INCORRECT PASSWORD",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              role: user[0].role,
            },
            config.secret,
            {
              expiresIn: config.expiresPassword,
            }
          );
          return res.status(200).json({
            message: "AUTH SUCCESSFULLY",
            token: token,
          });
        }
        res.status(404).json({
          message: "AUTH FAILED / INCORRECT PASSWORD",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.findByIdAndRemove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "USER SUCCESSFULLY DELETED",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.user_register = async function (req, res, next) {
  const body = req.body;
  let userToken;
  let userId;

  Users.create(body)
    .then((response) => {
      const data = { ...body, id: response };
      return Users.createToken(data);
    })
    .then((response) => {
      res.status(200);

      userId = response.id;
      userToken = response.token;

      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: body.email,
        subject: "Rent-a-Car: Verify your email",
        html: `<p>Verify your email address so you can login into your acount.</p><p>Press <a href=${
          currentUrl + "/user/verify/" + userId + "/" + userToken
        }>here</a> to proceed</p>`,
      };
      transporter
        .sendMail(mailOptions)
        .then((r) => console.log(r))
        .catch((e) => console.log(e));

      console.log("Token do Utilizador -> ", response);
      res.send(response);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
      console.log(err);
      next();
    });
};

exports.verifyEmail = (req, res) => {
  let { _id, token } = req.params;

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      res.send(err);
    }

    if (decoded.id === _id) {
      const response = await User.updateOne(
        { _id: decoded.id },
        { verified: true }
      );
      console.log("Correu tudo bem e vou verificar a conta!");
    } else {
      //IDS NÃO SÃO IGUAIS
      console.log(
        "Deu barraco e não vou fazer um crl.... od ids não são iguais"
      );
    }
  });

  res.send("The account has been verified successfully!");
};

exports.forgotPassword = (req, res, next) => {
  let email = req.body.email;

  let mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Rent-a-Car: Recover your password",
    html: `<p>Seems like you forgot the password to access your account.</p><p>Press <a href=${
      currentUrl + "user/changepassword/" + email
    }>here</a> to choose a new password.</p>`,
  };
  transporter
    .sendMail(mailOptions)
    .then(() =>
      res
        .status(200)
        .json({ message: "[EMAIL SENT]: Please check your email account!" })
    )
    .catch((e) => console.log(e));
};

exports.changePassword = (req, res, next) => {
  let email = req.params.email;
  let password = req.body.password;

  bcrypt
    .hash(password, saltRounds)
    .then(async (hashedPass) => {
      const response = await User.updateOne(
        { email },
        { password: hashedPass }
      );
      console.log(response);
      res.status(200).json({ message: "PASSWORD SUCCESSFULLY CHANGED" });
    })
    .catch((err) => console.log(err));
};

//======================== SignUp/Register [First Version] ================================//

// exports.user_signup = (req, res, next) => {
//   User.find({ email: req.body.email })
//     .exec()
//     .then((user) => {
//       if (user.length >= 1) {
//         return res.status(409).json({
//           message: "EMAIL ALREADY EXISTS",
//         });
//       } else {
//         bcrypt.hash(req.body.password, 10, (err, hash) => {
//           if (err) {
//             return res.status(500).json({
//               error: err,
//             });
//           } else {
//             const user = new User({
//               _id: new mongoose.Types.ObjectId(),
//               email: req.body.email,
//               password: hash,
//             });
//             user
//               .save()
//               .then((result) => {
//                 console.log(result);
//                 res.status(201).json({
//                   message: "USER SUCCESSFULLY CREATED",
//                 });
//               })
//               .catch((err) => {
//                 console.log(err);
//                 res.status(500).json({
//                   error: err,
//                 });
//               });
//           }
//         });
//       }
//     });
// };
