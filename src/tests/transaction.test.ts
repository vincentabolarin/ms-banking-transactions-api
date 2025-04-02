import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import Account from "../models/account.model.js";
import Transaction from "../models/transaction.model.js";

// Mock authentication middleware
const mockUserId = new mongoose.Types.ObjectId();
jest.mock("../middlewares/auth.middleware.js", () =>
  jest.fn((req, res, next) => {
    req.user = { id: mockUserId };
    next();
  })
);

describe("Transaction API Tests", () => {
  let mongoServer: MongoMemoryServer;
  let createdAccountIds: any[] = [];
  let account: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    await connectDB();
  });

  afterEach(async () => {
    await Account.deleteMany({ _id: { $in: createdAccountIds } });
    await Transaction.deleteMany({ _id: { $in: createdAccountIds } }); // Clean up transactions
    createdAccountIds = [];
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test("User can deposit successfully", async () => {
    account = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 100,
    });
    createdAccountIds.push(account._id);

    const res = await request(app).post("/api/transaction/deposit").send({
      accountId: account._id,
      amount: 50,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.message).toBe("Deposit successful");
    expect(res.body.data[0]).toHaveProperty("amount", 50);
    expect(res.body.data[0]).toHaveProperty("type", "deposit");

    // Check if balance is updated correctly
    const updatedAccount = await Account.findById(account._id);
    expect(updatedAccount.balance).toBe(150);
  });

  test("Fail to deposit with invalid amount", async () => {
    account = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 100,
    });
    createdAccountIds.push(account._id);

    const res = await request(app).post("/api/transaction/deposit").send({
      accountId: account._id,
      amount: -50,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toContain("must be a positive number");
  });

  test("Fail to deposit into non-existent account", async () => {
    const nonExistentAccountId = new mongoose.Types.ObjectId();

    const res = await request(app).post("/api/transaction/deposit").send({
      accountId: nonExistentAccountId,
      amount: 50,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("Account does not exist");
  });

  test("User can withdraw successfully", async () => {
    account = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 200,
    });
    createdAccountIds.push(account._id);

    const res = await request(app).post("/api/transaction/withdraw").send({
      accountId: account._id,
      amount: 100,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.message).toBe("Withdrawal successful");
    expect(res.body.data[0]).toHaveProperty("amount", 100);
    expect(res.body.data[0]).toHaveProperty("type", "withdrawal");

    // Check if balance is updated correctly
    const updatedAccount = await Account.findById(account._id);
    expect(updatedAccount.balance).toBe(100);
  });

  test("Fail to withdraw invalid amount", async () => {
    account = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 200,
    });
    createdAccountIds.push(account._id);

    const res = await request(app).post("/api/transaction/withdraw").send({
      accountId: account._id,
      amount: -100,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toContain("must be a positive number");
  });

  test("Fail to withdraw with insufficient funds", async () => {
    account = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 50,
    });
    createdAccountIds.push(account._id);

    const res = await request(app).post("/api/transaction/withdraw").send({
      accountId: account._id,
      amount: 100,
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("Insufficient funds");
  });

  test("User can transfer between accounts successfully", async () => {
    const senderAccount = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 500,
    });
    const receiverAccount = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 100,
    });
    createdAccountIds.push(senderAccount._id, receiverAccount._id);

    const res = await request(app).post("/api/transaction/transfer").send({
      senderAccountId: senderAccount._id,
      receiverAccountId: receiverAccount._id,
      amount: 200,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.message).toBe("Transfer successful");

    // Check if balances are updated correctly
    const updatedSenderAccount = await Account.findById(senderAccount._id);
    const updatedReceiverAccount = await Account.findById(receiverAccount._id);

    expect(updatedSenderAccount.balance).toBe(300);
    expect(updatedReceiverAccount.balance).toBe(300);
  });

  test("Fail to transfer with insufficient funds", async () => {
    const senderAccount = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 100,
    });
    const receiverAccount = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 50,
    });
    createdAccountIds.push(senderAccount._id, receiverAccount._id);

    const res = await request(app).post("/api/transaction/transfer").send({
      senderAccountId: senderAccount._id,
      receiverAccountId: receiverAccount._id,
      amount: 200,
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toBe("Insufficient funds");
  });

  test("User can view transactions", async () => {
    account = await Account.create({
      userId: mockUserId,
      currency: "USD",
      balance: 50,
    });
    createdAccountIds.push(account._id);

    const res = await request(app).get(`/api/transaction/${account._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect([
      "No transaction found for this account",
      "Transactions retrieved successfully",
    ]).toContain(res.body.message);
  });
});
