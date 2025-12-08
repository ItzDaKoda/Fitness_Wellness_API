const express = require("express");
const router = express.Router();
const { WellnessLog } = require("../database/models/associations");

// GET /api/wellness-logs
router.get("/", async (req, res, next) => {
  try {
    const logs = await WellnessLog.findAll();
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// GET /api/wellness-logs/:id
router.get("/:id", async (req, res, next) => {
  try {
    const log = await WellnessLog.findByPk(req.params.id);
    if (!log)
      return res.status(404).json({ error: "Wellness log not found" });
    res.json(log);
  } catch (err) {
    next(err);
  }
});

// POST /api/wellness-logs
router.post("/", async (req, res, next) => {
  try {
    const { userId, sleepHours, waterIntake, mood, habitsCompleted, date } =
      req.body;

    if (!userId || !date) {
      return res
        .status(400)
        .json({ error: "userId and date are required" });
    }

    const log = await WellnessLog.create({
      userId,
      sleepHours,
      waterIntake,
      mood,
      habitsCompleted,
      date,
    });

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
});

// PUT /api/wellness-logs/:id
router.put("/:id", async (req, res, next) => {
  try {
    const log = await WellnessLog.findByPk(req.params.id);
    if (!log)
      return res.status(404).json({ error: "Wellness log not found" });

    await log.update(req.body);
    res.json(log);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wellness-logs/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const log = await WellnessLog.findByPk(req.params.id);
    if (!log)
      return res.status(404).json({ error: "Wellness log not found" });

    await log.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
