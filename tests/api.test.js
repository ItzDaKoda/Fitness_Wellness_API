const request = require("supertest");
const app = require("../app");
const {
  sequelize,
  User,
  Workout,
  Goal,
  WellnessLog,
} = require("../database/models/associations");

let testUser;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  testUser = await User.create({
    name: "Test User",
    email: "test@example.com",
    passwordHash: "hash",
    role: "user",
  });

  await Workout.create({
    userId: testUser.id,
    exerciseName: "Running",
    duration: 20,
    intensity: "medium",
    caloriesBurned: 200,
    date: "2025-01-01",
  });

  await Goal.create({
    userId: testUser.id,
    goalType: "strength",
    targetValue: 100,
    currentValue: 50,
    deadline: "2025-02-01",
    isCompleted: false,
  });

  await WellnessLog.create({
    userId: testUser.id,
    sleepHours: 8,
    waterIntake: 64,
    mood: "good",
    habitsCompleted: true,
    date: "2025-01-01",
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Workouts API", () => {
  test("GET /api/workouts should return array", async () => {
    const res = await request(app).get("/api/workouts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/workouts/:id should return 404 for nonexistent id", async () => {
    const res = await request(app).get("/api/workouts/9999");
    expect(res.statusCode).toBe(404);
  });
});

describe("Goals API", () => {
  test("GET /api/goals should return array", async () => {
    const res = await request(app).get("/api/goals");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/goals should validate required fields", async () => {
    const res = await request(app).post("/api/goals").send({
      userId: testUser.id,
      // missing goalType / targetValue
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("Wellness Logs API", () => {
  test("GET /api/wellness-logs should return array", async () => {
    const res = await request(app).get("/api/wellness-logs");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/wellness-logs requires userId and date", async () => {
    const res = await request(app).post("/api/wellness-logs").send({
      sleepHours: 7,
    });
    expect(res.statusCode).toBe(400);
  });
});
