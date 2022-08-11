const express = require("express");
const Users = require("../models/Users");
const UsersRouter = express.Router();
const passport = require("passport");

UsersRouter.post("/register", (req, res, next) => {
  Users.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch(next);
});

UsersRouter.post("/login", passport.authenticate("local"), (req, res) => {
  req.login(req.user, function (err) {
    if (err) {
      return next(err);
    }
    return res.send(req.user);
  });
});
UsersRouter.post("/logout", (req, res, next) => {
  console.log("entrando al logout");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.sendStatus(200);
  });
});
UsersRouter.put("/update/:id", (req, res, next) => {
  const id = req.params.id;
  Users.update(req.body, { where: { id }, returning: true })
    .then(([affectedRows, user]) => {
      res.send(user[0]);
    })
    .catch(next);
});

UsersRouter.get("/", (req, res, next) => {
  Users.findAll()
    .then((users) => res.send(users))
    .catch(next);
});

module.exports = UsersRouter;
