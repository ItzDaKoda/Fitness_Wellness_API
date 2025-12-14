const express = require("express");
const router = express.Router();
const { WellnessLog } = require("../database/models/associations");
const { authenticate, requireOwnerOrRole } = require("../middleware/auth");

// All wellness log routes require login
router.use(authenticate);

// GET /api/wellness-logs
// user -> only theirs
// coach -> all
router.get("/", async (req, res, next) => {
  try {
    const where = req.user.role === "coach" ? {} : { userId: req.user.id };
    const logs = await WellnessLog.findAll({ where });
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// GET /api/wellness-logs/:id
router.get(
  "/:id",
  requireOwnerOrRole(async (req) => {
    const log = await WellnessLog.findByPk(req.params.id);
    return log?.userId ?? null;
  }, "coach"),
  async (req, res, next) => {
    try {
      const log = await WellnessLog.findByPk(req.params.id);
      if (!log) return res.status(404).json({ error: "Wellness log not found" });
      res.json(log);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/wellness-logs
// user -> creates for self
// coach -> can create for any userId (must provide)
router.post("/", async (req, res, next) => {
  try {
    const { userId, sleepHours, waterIntake, mood, habitsCompleted, date } = req.body;

    if (!date) {
      return res.status(400).json({ error: "date is required" });
    }

    let ownerId = req.user.id;
    if (req.user.role === "coach") {
      if (!userId) return res.status(400).json({ error: "userId is required for coach-created logs" });
      ownerId = userId;
    }

    const log = await WellnessLog.create({
      userId: ownerId,
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
router.put(
  "/:id",
  requireOwnerOrRole(async (req) => {
    const log = await WellnessLog.findByPk(req.params.id);
    return log?.userId ?? null;
  }, "coach"),
  async (req, res, next) => {
    try {
      const log = await WellnessLog.findByPk(req.params.id);
      if (!log) return res.status(404).json({ error: "Wellness log not found" });

      if (req.user.role !== "coach") delete req.body.userId;

      await log.update(req.body);
      res.json(log);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/wellness-logs/:id
router.delete(
  "/:id",
  requireOwnerOrRole(async (req) => {
    const log = await WellnessLog.findByPk(req.params.id);
    return log?.userId ?? null;
  }, "coach"),
  async (req, res, next) => {
    try {
      const log = await WellnessLog.findByPk(req.params.id);
      if (!log) return res.status(404).json({ error: "Wellness log not found" });

      await log.destroy();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
