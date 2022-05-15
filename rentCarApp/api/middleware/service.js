const config = require("../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function UserService(UserModel) {
  let service = {
    create,
    createToken,
    verifyToken,
    findUser,
    createPassword,
  };

  function create(user) {
    return createPassword(user).then((hashPassword, err) => {
      if (err) {
        return Promise.reject("Not Saved");
      }

      let newUserWithPassword = {
        ...user,
        password: hashPassword,
      };
      let newUser = UserModel(newUserWithPassword);
      return save(newUser);
    });
  }

  function save(model) {
    return new Promise(function (resolve, reject) {
      model.save(function (err, data) {
        console.log(data);
        const modelId = data._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        if (err) reject("There is a problem with register");

        resolve(modelId);
      });
    });
  }

  function createToken(user) {
    console.log(user);
    let token = jwt.sign({ id: user.id, name: user.name }, config.secret, {
      expiresIn: config.expiresPassword,
    });

    return { auth: true, token, id: user.id };
  }

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject();
        }
        return resolve(decoded);
      });
    });
  }

  function findUser({ email, password }) {
    return new Promise(function (resolve, reject) {
      UserModel.findOne({ email }, function (err, user) {
        if (err) reject(err);

        if (!user) {
          reject("This data is wrong");
        }

        resolve(user);
      });
    }).then((user) => {
      return comparePassword(password, user.password).then((match) => {
        if (!match) return Promise.reject("User not valid");
        return Promise.resolve(user);
      });
    });
  }

  function createPassword(user) {
    return bcrypt.hash(user.password, config.saltRounds);
  }

  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  return service;
}

module.exports = UserService;
