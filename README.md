# Park.me Backend

<p align="center">
  <img src="./src/assets/cover.png" alt="Park.me Logo" width="400" />
</p>

## Overview

This is the backend API for the Park.me application, a platform for renting and finding parking spaces.

## Tech Stack

*   **Node.js**
*   **Express.js**
*   **MongoDB**
*   **Cloudflare R2**
*   **Docker**
*   **GitHub Actions**

## Prerequisites

*   Node.js (v18 or higher)
*   npm
*   MongoDB instance (local or cloud-based)
*   Cloudflare R2 account and bucket credentials

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# MongoDB connection string
DB_URL=<YOUR_MONGODB_URL>

# Secret for signing cookies
COOKIE_SECRET=your_strong_cookie_secret

# Cloudflare R2 Credentials
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<YOUR_R2_ACCESS_KEY_ID>
R2_SECRET_ACCESS_KEY=<YOUR_R2_SECRET_ACCESS_KEY>
R2_BUCKET=<YOUR_BUCKET_NAME>
```

Replace the placeholder values with your actual credentials and configuration.

## Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/gbolf/park.me-backend.git
    cd park.me-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your `.env` file** as described above.
4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:3000`.

## Building with Docker

1.  **Build the Docker image:**
    ```bash
    docker build -t park-me-backend .
    ```
2.  **Run the Docker container:**
    Make sure your `.env` file is present in the directory where you run the command.
    ```bash
    docker run -p 3000:3000 --env-file .env --name parkme-api park-me-backend
    ```
    The API will be accessible at `http://localhost:3000`.

## Deployment

This project includes a GitHub Actions workflow (`.github/workflows/node.js.yml`) configured to:

1.  Build the Node.js application.
2.  Build a Docker image.
3.  Push the Docker image to GitHub Container Registry (GHCR).
4.  Trigger a deployment to api.park.me.gbolf.com

Deployment happens automatically on pushes to the `main` branch.
