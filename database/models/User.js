const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },

  passwordHash: { type: DataTypes.STRING, allowNull: false },

  role: {
    type: DataTypes.ENUM("user", "coach"),
    allowNull: false,
    defaultValue: "user",
  },
});

module.exports = User;
