const express = require("express");
const UsersRouter = require('./users');
const router = express.Router();

router.use('/users', UsersRouter);


module.exports = router;
