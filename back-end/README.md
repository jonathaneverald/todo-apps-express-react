# Project Name

This is a simple To Do back end application built with ExpressJS

## Table of Contents

-   [Installation](#installation)
-   [Running the Project](#running-the-project)

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/jonathaneverald/todo-apps-express-react.git
    ```
2. **Navigate into the project directory**:

    ```bash
    cd back-end
    ```

3. **Create and Configure the Environment Variables**:

    - Create a .env file in the root directory of the project:

        ```bash
        touch .env
        ```

    - Open the .env file in a text editor and add the following line, replacing <user>, <password>, <host>, <port>, and <database_name> with your actual MySQL database credentials:

        ```bash
        DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<database_name>"
        ```

4. **Install dependencies: Make sure you have Node.js installed, then run**:

    ```bash
    npm install
    ```

5. **Setup Database with Prisma**:
    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

## Running the Project

```bash
npm run build
npm run start
```

This command runs the app in development mode. Open http://localhost:3000/api-docs to view the api documentations in the browser.
