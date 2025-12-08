const express = require("express");
const router = express.Router();
const { User } = require("../database/models/associations");

// GET /api/users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST /api/users
router.post("/", async (req, res, next) => {
  try {
    const { name, email, passwordHash, role, age, height, weight } = req.body;
    if (!name || !email || !passwordHash) {
      return res
        .status(400)
        .json({ error: "name, email, and passwordHash are required" });
    }

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "user",
      age,
      height,
      weight,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/:id
router.put("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
