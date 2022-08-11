const express = require("express");
const UsersRouter = require('./users');
router.use('/users', UsersRouter);


module.exports = router;
