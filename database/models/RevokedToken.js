const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const RevokedToken = sequelize.define("RevokedToken", {
  jti: { type: DataTypes.STRING, allowNull: false, unique: true },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
});

module.exports = RevokedToken;
