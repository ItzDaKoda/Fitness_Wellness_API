const { Sequelize } = require("sequelize");
const path = require("path");

const env = process.env.NODE_ENV || "development";

const storage =
  env === "test"
    ? path.join(__dirname, "..", "fitness_test.db")
    : path.join(__dirname, "..", "fitness.db");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
});

module.exports = { sequelize };
