const express = require("express");
const router = express.Router();
const { Workout } = require("../database/models/associations");

// GET /api/workouts
router.get("/", async (req, res, next) => {
  try {
    const workouts = await Workout.findAll();
    res.json(workouts);
  } catch (err) {
    next(err);
  }
});

// GET /api/workouts/:id
router.get("/:id", async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout)
      return res.status(404).json({ error: "Workout not found" });
    res.json(workout);
  } catch (err) {
    next(err);
  }
});

// POST /api/workouts
router.post("/", async (req, res, next) => {
  try {
    const {
      userId,
      exerciseName,
      duration,
      intensity,
      caloriesBurned,
      date,
      notes,
    } = req.body;

    if (!userId || !exerciseName || !duration || !date) {
      return res.status(400).json({
        error: "userId, exerciseName, duration, and date are required",
      });
    }

    const workout = await Workout.create({
      userId,
      exerciseName,
      duration,
      intensity,
      caloriesBurned,
      date,
      notes,
    });

    res.status(201).json(workout);
  } catch (err) {
    next(err);
  }
});

// PUT /api/workouts/:id
router.put("/:id", async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout)
      return res.status(404).json({ error: "Workout not found" });

    await workout.update(req.body);
    res.json(workout);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/workouts/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout)
      return res.status(404).json({ error: "Workout not found" });

    await workout.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
