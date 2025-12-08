const { sequelize } = require("./index");
const User = require("./User");
const Workout = require("./Workout");
const Goal = require("./Goal");
const WellnessLog = require("./WellnessLog");

// User 1-Many Workout
User.hasMany(Workout, { foreignKey: "userId", onDelete: "CASCADE" });
Workout.belongsTo(User, { foreignKey: "userId" });

// User 1-Many Goal
User.hasMany(Goal, { foreignKey: "userId", onDelete: "CASCADE" });
Goal.belongsTo(User, { foreignKey: "userId" });

// User 1-Many WellnessLog
User.hasMany(WellnessLog, { foreignKey: "userId", onDelete: "CASCADE" });
WellnessLog.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Workout,
  Goal,
  WellnessLog,
};
