const express = require("express");
const router = express.Router();
const { User } = require("../database/models/associations");
const { authenticate, requireRole } = require("../middleware/auth");

// GET /api/users/me (any logged-in user)
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "age", "height", "weight"]
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// GET /api/users (coach only)
router.get("/", authenticate, requireRole("coach"), async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "age", "height", "weight"]
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id (coach only)
router.get("/:id", authenticate, requireRole("coach"), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "role", "age", "height", "weight"]
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
