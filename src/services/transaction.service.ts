import { injectable, inject } from "tsyringe";
import mongoose from "mongoose";
import { TransactionRepository } from "../repositories/transaction.repository.js";
import { AccountRepository } from "../repositories/account.repository.js";
import { ErrorResponse, SuccessResponse } from "../utils/responseHandler.js";

@injectable()
export class TransactionService {
  constructor(
    @inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @inject(AccountRepository) private accountRepository: AccountRepository
  ) {}

  deposit = async (
    accountId: mongoose.Types.ObjectId,
    amount: number
  ) => {
    // Check if amount is greater than zero
    if (amount <= 0)
      return new ErrorResponse("Deposit amount must be greater than zero");

    // Check if the account exists
    const account = await this.accountRepository.findById(accountId);
    if (!account) return new ErrorResponse("Account does not exist");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this.accountRepository.updateBalance(accountId, amount, session);
      const transaction = await this.transactionRepository.create(
        { accountId, amount, type: "deposit" },
        session
      );

      await session.commitTransaction();
      session.endSession();
      return new SuccessResponse("Deposit successful", transaction);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return new ErrorResponse("Error processing deposit", error.message);
    }
  };

  withdraw = async (
    accountId: mongoose.Types.ObjectId,
    amount: number
  ) => {
    // Check if amount is greater than zero
    if (amount <= 0)
      return new ErrorResponse("Withdrawal amount must be greater than zero");

    // Check if the account exists
    const account = await this.accountRepository.findById(accountId);
    if (!account) return new ErrorResponse("Account does not exist");

    // Check if the account has sufficient balance
    if (account && account.balance < amount)
      return new ErrorResponse("Insufficient funds");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this.accountRepository.updateBalance(accountId, -amount, session);
      const transaction = await this.transactionRepository.create(
        { accountId, amount, type: "withdrawal" },
        session
      );

      await session.commitTransaction();
      session.endSession();
      return new SuccessResponse("Withdrawal successful", transaction);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return new ErrorResponse("Error processing withdrawal", error.message);
    }
  };

  transfer = async (
    senderAccountId: mongoose.Types.ObjectId,
    receiverAccountId: mongoose.Types.ObjectId,
    amount: number
  ) => {
    // Check if amount is greater than zero
    if (amount <= 0) {
      return new ErrorResponse("Transfer amount must be greater than zero");
    }

    // Check if the sender account exists
    const senderAccount = await this.accountRepository.findById(
      senderAccountId
    );

    if (!senderAccount) {
      return new ErrorResponse("Sender account does not exist");
    }

    // Check if the receiver account exists
    const receiverAccount = await this.accountRepository.findById(
      receiverAccountId
    );

    if (!receiverAccount) {
      return new ErrorResponse("Receiver account does not exist");
    }

    // Check if the sender and receiver accounts are different
    if (senderAccountId === receiverAccountId) {
      return new ErrorResponse(
        "Sender and Receiver accounts must be different"
      );
    }

    // Check if the sender account has sufficient balance
    if (senderAccount.balance < amount) {
      return new ErrorResponse("Insufficient funds");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this.accountRepository.updateBalance(
        senderAccountId,
        -amount,
        session
      );
      await this.accountRepository.updateBalance(
        receiverAccountId,
        amount,
        session
      );

      const transaction = await this.transactionRepository.create(
        { accountId: senderAccountId, senderAccountId, receiverAccountId, amount, type: "transfer" },
        session
      );

      await session.commitTransaction();
      session.endSession();
      return new SuccessResponse("Transfer successful", transaction);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return new ErrorResponse("Error processing transfer", error.message);
    }
  };

  getTransactions = async (accountId: mongoose.Types.ObjectId) => {
    // Check if the account exists
    const account = await this.accountRepository.findById(
      accountId
    );

    if (!account) {
      return new ErrorResponse("Account does not exist");
    }

    const transactions = await this.transactionRepository.findAllByAccount(accountId);

    // Check if there are any transactions for the account
    if (!transactions) {
      return new ErrorResponse("No transaction found for this account");
    }
    return new SuccessResponse("Transactions retrieved successfully", transactions);
  };
}
