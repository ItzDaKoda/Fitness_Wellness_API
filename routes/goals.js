const express = require("express");
const router = express.Router();
const { Goal } = require("../database/models/associations");
const { authenticate, requireRole, requireOwnerOrRole } = require("../middleware/auth");

// All goals routes require login
router.use(authenticate);

// GET /api/goals
// user -> only their goals
// coach -> all goals
router.get("/", async (req, res, next) => {
  try {
    const where = req.user.role === "coach" ? {} : { userId: req.user.id };
    const goals = await Goal.findAll({ where });
    res.json(goals);
  } catch (err) {
    next(err);
  }
});

// GET /api/goals/:id
router.get(
  "/:id",
  requireOwnerOrRole(async (req) => {
    const goal = await Goal.findByPk(req.params.id);
    return goal?.userId ?? null;
  }, "coach"),
  async (req, res, next) => {
    try {
      const goal = await Goal.findByPk(req.params.id);
      if (!goal) return res.status(404).json({ error: "Goal not found" });
      res.json(goal);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/goals
// user creates for self (ignore userId in body)
// coach can create for any userId (must provide)
router.post("/", async (req, res, next) => {
  try {
    const {
      userId, // only coach can use this
      goalType,
      targetValue,
      currentValue,
      deadline,
      isCompleted,
    } = req.body;

    if (!goalType || targetValue == null) {
      return res.status(400).json({ error: "goalType and targetValue are required" });
    }

    let ownerId = req.user.id;
    if (req.user.role === "coach") {
      if (!userId) return res.status(400).json({ error: "userId is required for coach-created goals" });
      ownerId = userId;
    }

    const goal = await Goal.create({
      userId: ownerId,
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
router.put(
  "/:id",
  requireOwnerOrRole(async (req) => {
    const goal = await Goal.findByPk(req.params.id);
    return goal?.userId ?? null;
  }, "coach"),
  async (req, res, next) => {
    try {
      const goal = await Goal.findByPk(req.params.id);
      if (!goal) return res.status(404).json({ error: "Goal not found" });

      // prevent changing ownership unless coach
      if (req.user.role !== "coach") delete req.body.userId;

      await goal.update(req.body);
      res.json(goal);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/goals/:id
router.delete(
  "/:id",
  requireOwnerOrRole(async (req) => {
    const goal = await Goal.findByPk(req.params.id);
    return goal?.userId ?? null;
  }, "coach"),
  async (req, res, next) => {
    try {
      const goal = await Goal.findByPk(req.params.id);
      if (!goal) return res.status(404).json({ error: "Goal not found" });

      await goal.destroy();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
