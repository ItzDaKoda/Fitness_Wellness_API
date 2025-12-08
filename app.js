const express = require("express");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const userRoutes = require("./routes/users");
const workoutRoutes = require("./routes/workouts");
const goalRoutes = require("./routes/goals");
const wellnessRoutes = require("./routes/wellnessLogs");

const app = express();

// Core middleware
app.use(express.json());
app.use(logger);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Fitness & Wellness Tracker API" });
});

// Resource routes
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/wellness-logs", wellnessRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
