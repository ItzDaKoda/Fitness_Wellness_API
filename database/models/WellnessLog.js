const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const WellnessLog = sequelize.define("WellnessLog", {
  sleepHours: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  waterIntake: {
    type: DataTypes.INTEGER, // ounces
    allowNull: true,
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  habitsCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = WellnessLog;
