const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Workout = sequelize.define("Workout", {
  exerciseName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // minutes
    allowNull: false,
    validate: { min: 1 },
  },
  intensity: {
    type: DataTypes.ENUM("low", "medium", "high"),
    allowNull: false,
    defaultValue: "medium",
  },
  caloriesBurned: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Workout;
