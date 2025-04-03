# OCTOMATE-VOTE-API

This project is a **simple Express.js API written in TypeScript**. It provides a structured foundation for building RESTful APIs with features like organized routing, middleware setup, seeders for initial data population, and simple features (user management, vote candidates).

## Project Structure

  
    ├── src/ 
    │   ├── apis/
    │   │   ├── global/
    │   │   ├── auth/
    │   │   ├── health/
    │   │   ├── user/
    │   │   └── v1/
    │   │       ├── controllers/
    │   │       ├── dtos/
    │   │       ├── models/
    │   │       ├── routes/
    │   │       ├── services/
    │   │       └── tests/
    │   ├── configs/
    │   ├── constants/
    │   ├── middlewares/
    │   ├── seeders/
    │   └── utils/
    ├── app.ts
    ├── server.ts
    ├── .env
    ├── .env.example
    ├── .eslintrc.js
    ├── .gitignore
    ├── .prettierrc
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json

## API Routes

**Health Check (`/api/health`):**
* **`GET /`:** For making sure Api is running.

**Authentication (`/api/auth`):**
* **`POST /register`:** Register a new user.
* **`POST /login`:** Log in a user.
* **`POST /refresh-token`:** Refresh the JWT token.

**User Management (`/api/user`):**
* **`POST /`:** Create new user.
* **`GET /`:** Get list user.
* **`GET /:user_id`:** Get user detail.
* **`PATCH /:user_id`:** Update user.
* **`DELETE /:user_id`:** Delete user.

**Votes (`/api/v1/vote`):**
* **`POST /`:** Vote a candidate.
* **`GET /`:** Get list candidate.
* **`GET /total`:** Get total all vote, and per candidates.

## Prerequisites

* Node.js (v18 or higher)
* npm (or yarn)

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd msafrun-express-ts-boilerplate
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create `.env` file:**

    Copy the contents of `.env.example` to a new file named `.env` in the root directory and update the values with your environment-specific configurations.

    ```bash
    cp .env.example .env
    ```

    **Example `.env`:**

    ```
    PORT=5000
    NODE_ENV=development
    MONGO_URI=mongodb://username:password@host:27017/database
    JWT_SECRET=your_jwt_secret
    JWT_SECRET_REFRESH=your_jwt_secret_refresh
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_EXPIRY=7d
    ```

4.  **Run the seeder:**

    Before starting the application, you need to run the seeder to populate the database with initial data (roles and users).

    ```bash
    npm run seed
    ```

    This command will execute the `seed.ts` script in the `src/seeders` directory.

5.  **Run the application:**

    ```bash
    npm run dev # for development
    ```

## Available Scripts

* **`npm run dev`**: Runs the application in development mode with hot reloading.
* **`npm run start`**: Starts the application in production mode.
* **`npm run seed`**: Runs the database seeder.
* **`npm run test:unit`**: Runs unit testing.

## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues.

## License

[MIT](LICENSE)