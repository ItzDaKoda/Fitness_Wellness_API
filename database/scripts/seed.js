const bcrypt = require("bcrypt");
const {
  sequelize,
  User,
  Workout,
  Goal,
  WellnessLog,
} = require("../models/associations");

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const passwordHash = await bcrypt.hash("password123", 10);

    const user = await User.create({
      name: "Alex Runner",
      email: "alex@example.com",
      passwordHash,
      role: "user",
      age: 25,
      height: 170,
      weight: 160,
    });

    await User.create({
      name: "Coach Taylor",
      email: "coach@example.com",
      passwordHash,
      role: "coach",
    });

    await Workout.create({
      userId: user.id,
      exerciseName: "Running",
      duration: 30,
      intensity: "medium",
      caloriesBurned: 250,
      date: new Date().toISOString().slice(0, 10),
      notes: "Felt great",
    });

    await Goal.create({
      userId: user.id,
      goalType: "weight_loss",
      targetValue: 150,
      currentValue: 165,
      deadline: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10),
      isCompleted: false,
    });

    await WellnessLog.create({
      userId: user.id,
      sleepHours: 7.5,
      waterIntake: 64,
      mood: "energized",
      habitsCompleted: true,
      date: new Date().toISOString().slice(0, 10),
    });

    console.log("Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
