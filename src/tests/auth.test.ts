import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import connectDB from "../config/db.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import userModel from "../models/user.model.js";

const testUser = {
  firstName: "Jaden",
  lastName: "Doe",
  email: "jadendoe@example.com",
  password: "password123",
};

let authToken: string;

describe("Authentication API Tests", () => {
  let mongoServer: MongoMemoryServer;
  let createdUserIds: any[] = [];

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    await connectDB();
  });

  afterEach(async () => {
    await userModel.deleteMany({ _id: { $in: createdUserIds } });
    createdUserIds = [];
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("User can register successfully", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body).toHaveProperty("data");

    createdUserIds.push(res.body.data._id);
  });

  test("Registration fails for duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("User already exists");
  });

  test("User can log in successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).toHaveProperty("user");

    authToken = res.body.data.token;
  });

  test("Login fails for incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("Protected route access without Authorization header", async () => {
    const res = await request(app).get("/api/account");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("Access denied; no authorization header provided");
  });

  test("Protected route access without token", async () => {
    const res = await request(app)
      .get("/api/account")
      .set("Authorization", "Bearer ");;

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("Access denied; no valid token provided");
  });

  test("Protected route access with invalid token", async () => {
    const res = await request(app)
      .get("/api/account")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("Invalid token");
  });
});
