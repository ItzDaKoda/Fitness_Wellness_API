const express = require("express");
const router = express.Router();
const { Workout } = require("../database/models/associations");

const { authenticate, requireRole, requireOwnerOrRole } = require("../middleware/auth");

// All workout routes require login
router.use(authenticate);

// GET all (user = only theirs, coach = all)
router.get("/", authenticate, async (req, res, next) => {
  try {
    const where = req.user.role === "coach" ? {} : { userId: req.user.id };
    const workouts = await Workout.findAll({ where });
    res.json(workouts);
  } catch (err) {
    next(err);
  }
});

// GET by id (user = only theirs, coach = any)
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) return res.status(404).json({ error: "Workout not found" });

    if (req.user.role !== "coach" && workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: not your workout" });
    }

    res.json(workout);
  } catch (err) {
    next(err);
  }
});

// POST (users only; userId forced to token user)
router.post("/", authenticate, requireRole("user"), async (req, res, next) => {
  try {
    const { exerciseName, duration, intensity, caloriesBurned, date, notes } = req.body;

    if (!exerciseName || !duration || !date) {
      return res.status(400).json({ error: "exerciseName, duration, and date are required" });
    }

    const workout = await Workout.create({
      userId: req.user.id,
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

// PUT (users only; only own)
router.put("/:id", authenticate, requireRole("user"), async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) return res.status(404).json({ error: "Workout not found" });

    if (workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: not your workout" });
    }

    await workout.update(req.body);
    res.json(workout);
  } catch (err) {
    next(err);
  }
});

// DELETE (users only; only own)
router.delete("/:id", authenticate, requireRole("user"), async (req, res, next) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) return res.status(404).json({ error: "Workout not found" });

    if (workout.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: not your workout" });
    }

    await workout.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
