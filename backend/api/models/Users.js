const s = require("sequelize");
const db = require("../db");
const bcrypt = require("bcrypt");

class Users extends s.Model {
  hash(password, salt) {
    return bcrypt.hash(password, salt);
  }
}

Users.init(
  {
    name: {
      type: s.STRING,
      allowNull: false,
    },
    lastName: {
      type: s.STRING,
      allowNull: false,
    },
    email: {
      type: s.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: s.TEXT,
      allowNull: false,
    },
    salt: {
      type: s.STRING,
    },
  },
  { sequelize: db, modelName: "users" }
);

Users.beforeCreate((user) => {
  return bcrypt
    .genSalt(16)
    .then((salt) => {
      user.salt = salt;
      return user.hash(user.password, salt);
    })
    .then((hash) => {
      user.password = hash;
    });
});

module.exports = Users;
