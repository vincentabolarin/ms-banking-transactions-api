import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import Account from "../models/account.model.js";

// Mock authentication middleware
const mockUserId = new mongoose.Types.ObjectId();
jest.mock("../middlewares/auth.middleware.js", () =>
  jest.fn((req, res, next) => {
    req.user = { id: mockUserId };
    next();
  })
);

describe("Account API Tests", () => {
  let mongoServer: MongoMemoryServer;
  let createdAccountIds: any[] = [];
  
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    await connectDB();
  });

  afterEach(async () => {
    await Account.deleteMany({ _id: { $in: createdAccountIds } });
    createdAccountIds = [];
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("User can create an account successfully", async () => {
    const res = await request(app).post("/api/account").send({
      currency: "USD",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.message).toBe("Account created successfully");
    expect(res.body.data).toHaveProperty("currency", "USD");
    expect(res.body.data).toHaveProperty("balance", 0);

    createdAccountIds.push(res.body.data._id);
  });

  test("Fail to create an account if one already exists", async () => {
    // Manually create an account in the test DB
    const account = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 0,
    });

    const res = await request(app).post("/api/account").send({
      currency: "USD",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("An Account already exists for this user");

    createdAccountIds.push(account._id);
  });

  test("User can retrieve their account", async () => {
    const account = await Account.create({
      userId: mockUserId,
      currency: "EUR",
      balance: 500,
    });

    const res = await request(app).get("/api/account");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.message).toBe("Account fetched successfully");
    expect(res.body.data).toHaveProperty("currency", "EUR");
    expect(res.body.data).toHaveProperty("balance", 500);

    createdAccountIds.push(account._id);
  });

  test("Fail to retrieve account if none exists", async () => {
    const res = await request(app).get("/api/account");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("Account not found");
  });
});
