var db = require("../config/db.config");
var config = require("../config/auth.config");
var User = db.user;
var globalFunctions = require("../config/global.functions.js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// регистрация пользователя
exports.register = (req, res) => {
  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10), // генерация хеша пароля
    role: req.body.role,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    middlename: req.body.middlename,
  })
    .then(() => {
      var result = {
        message: "Пользователь зарегистрирован",
      };
      globalFunctions.sendResult(res, result);
    })
    .catch((err) => {
      globalFunctions.sendError(res, err);
    });
};

// проверка данных пользователя
exports.login = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Неверно введенный логин и/или пароль" });
        return;
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        res.status(401).send({
          accessToken: null,
          message: "Неверно введенный логин и/или пароль",
        });
        return;
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: "1h", // 1 час — время действия токена
      });
      console.log("Токен при авторизации");
      console.log(token);
      var object = {
        id: user.id,
        username: user.username,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename,
        accessToken: token,
      };
      globalFunctions.sendResult(res, object);
    })
    .catch((err) => {
      globalFunctions.sendError(res, err);
    });
};

// обновление токена jwt (когда срок действия текущего истекает)
exports.refreshToken = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        globalFunctions.sendError(res, "Неверно введенный логин и/или пароль");
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: "1h", // 1 час — время действия токена
      });
      console.log("Новый токен");
      console.log(token);
      var object = {
        id: user.id,
        username: user.username,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename,
        accessToken: token,
      };
      globalFunctions.sendResult(res, object);
    })
    .catch((err) => {
      globalFunctions.sendError(res, err);
    });
};

// проверка, что пользователь авторизован
exports.userBoard = (req, res) => {
  globalFunctions.sendResult(res, "Пользователь авторизован");
};
