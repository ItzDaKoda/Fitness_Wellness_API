const express = require("express");
const router = express.Router();
const { Goal } = require("../database/models/associations");

// GET /api/goals
router.get("/", async (req, res, next) => {
  try {
    const goals = await Goal.findAll();
    res.json(goals);
  } catch (err) {
    next(err);
  }
});

// GET /api/goals/:id
router.get("/:id", async (req, res, next) => {
  try {
    const goal = await Goal.findByPk(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json(goal);
  } catch (err) {
    next(err);
  }
});

// POST /api/goals
router.post("/", async (req, res, next) => {
  try {
    const {
      userId,
      goalType,
      targetValue,
      currentValue,
      deadline,
      isCompleted,
    } = req.body;

    if (!userId || !goalType || targetValue == null) {
      return res.status(400).json({
        error: "userId, goalType, and targetValue are required",
      });
    }

    const goal = await Goal.create({
      userId,
      goalType,
      targetValue,
      currentValue,
      deadline,
      isCompleted,
    });

    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
});

// PUT /api/goals/:id
router.put("/:id", async (req, res, next) => {
  try {
    const goal = await Goal.findByPk(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    await goal.update(req.body);
    res.json(goal);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/goals/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const goal = await Goal.findByPk(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    await goal.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
