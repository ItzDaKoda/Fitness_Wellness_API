const { sequelize } = require("../models/associations");

async function setup() {
  try {
    await sequelize.sync({ force: true }); // drops & recreates all tables
    console.log("Database synced successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error syncing database:", err);
    process.exit(1);
  }
}

setup();
