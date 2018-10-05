'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _verify = require('./verify');

var _verify2 = _interopRequireDefault(_verify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { runInNewContext } from 'vm';

var router = _express2.default.Router();
// import {Client} from 'pg';


_config2.default.connect().then(function () {
  return console.log('connected');
}).catch(function (err) {
  return console.error('connection error', err.stack);
});

router.post("/login", function (req, res) {

  var username = req.body.username;
  var password = req.body.password;

  _config2.default.query('SELECT * FROM user_tbl WHERE username = $1', [username], function (error, results) {

    if (error) {
      res.json({ "err": error });
    }
    if (results.rows.length && results.rows[0].password === password) {

      var token = _verify2.default.getToken({ username: username, "admin": results.rows[0].admin });
      res.send({
        "success": "Login successful",
        "token": token
      });
    } else {
      res.send({
        "success": "You must be a Registered user"
      });
    }
  });
});

router.post("/signup", function (req, res) {

  var userPattern = /[A-Za-z0-9]{6,}/;
  var passPattern = /.{6,}/;
  var username = void 0;
  var password = void 0;

  if (userPattern.test(req.body.username) && passPattern.test(req.body.password)) {
    username = req.body.username;
    password = req.body.password;
    _config2.default.query('INSERT INTO user_tbl  (username,password) VALUES ($1,$2)', [username, password], function (error) {
      if (error) {
        res.json({
          "code": 400,
          "failed": error.detail
        });
      } else {
        var token = _verify2.default.getToken({ username: username });
        res.json({
          "code": 201,
          "success": "user registered successfully",
          "token": token
        });
      }
    });
  } else {
    res.status(400).end("Your username and password should be at least 6 characters");
  }
});

exports.default = router;
module.exports = exports.default;