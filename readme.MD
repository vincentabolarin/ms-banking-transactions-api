# Account Management API

This is an API for managing user accounts, supporting account creation, account retrieval, and transaction handling. It is built using Node.js, Express, and MongoDB, with unit tests powered by Jest and running in a test environment using Mongo Memory Server.

## Features

- User account creation (supports only one account per user).
- Retrieve the user's account information.
- Basic transaction management (deposit, withdrawal, etc.).
- Unit testing using Jest.
- Authentication middleware (mocked for testing purposes).

## Technologies Used

- **Backend:** Node.js, Express
- **Database:** MongoDB (in-memory for tests via Mongo Memory Server)
- **Testing:** Jest, Supertest
- **Middleware:** Mocked authentication middleware
- **Environment Variables:** dotenv

## Setup

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (version >= 14.x)
- npm or yarn
- MongoDB (for development, can use in-memory MongoDB for testing)

### Install Dependencies

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-repo/account-management-api.git
cd account-management-api
npm install
