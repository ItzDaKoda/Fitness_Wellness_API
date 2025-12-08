const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Goal = sequelize.define("Goal", {
  goalType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currentValue: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Goal;
