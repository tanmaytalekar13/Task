# Backend Project Documentation

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation Instructions](#installation-instructions)
- [API Documentation](#api-documentation)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Add Address](#add-address)
  - [Get Addresses](#get-addresses)
  - [Add Recent Search](#add-recent-search)
  - [Get Recent Searches](#get-recent-searches)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

## Project Description
This backend project is built with Node.js, Express.js, and MongoDB. It handles user authentication with JWT, provides location-based services using OpenStreetMap, and offers various API endpoints for managing user data and other features.

## Features
- User authentication with JWT
- Location-based services using OpenStreetMap
- API endpoints for managing user data
- Address management
- Recent searches management

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Joi (for validation)
- JWT (for authentication)

## Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)

### Installation
1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```

2. Navigate to the backend directory:
    ```sh
    cd /Users/tanmay/Desktop/Task/Backend
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

4. Create a `.env` file in the backend directory and add the following environment variables:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

5. Start the server:
    ```sh
    npm start
    ```

## API Documentation

### User Registration
- **Endpoint**: `POST /api/users/signup`
- **Description**: Register a new user.
- **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
- **Response**:
    ```json
    {
      "message": "User created successfully"
    }
    ```
- **Example**:
    ```sh
    curl -X POST http://localhost:8000/api/users/signup -H "Content-Type: application/json" -d '{"username": "testuser", "password": "testpassword"}'
    ```

### User Login
- **Endpoint**: `POST /api/users/signin`
- **Description**: Login an existing user.
- **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
- **Response**:
    ```json
    {
      "token": "JWT token"
    }
    ```
- **Example**:
    ```sh
    curl -X POST http://localhost:8000/api/users/signin -H "Content-Type: application/json" -d '{"username": "testuser", "password": "testpassword"}'
    ```

### Add Address
- **Endpoint**: `POST /api/users/address`
- **Description**: Add a new address (requires authentication).
- **Request Body**:
    ```json
    {
      "address": {
        "house": "string",
        "apartment": "string",
        "category": "string",
        "fullAddress": "string"
      }
    }
    ```
- **Response**:
    ```json
    {
      "message": "Address added successfully"
    }
    ```
- **Example**:
    ```sh
    curl -X POST http://localhost:8000/api/users/address -H "Authorization: Bearer <JWT token>" -H "Content-Type: application/json" -d '{"address": {"house": "123", "apartment": "Apt 1", "category": "Home", "fullAddress": "123 Main St, City, State, 12345, Country"}}'
    ```

### Get Addresses
- **Endpoint**: `GET /api/users/addresses`
- **Description**: Get all addresses for the authenticated user.
- **Response**:
    ```json
    [
      {
        "house": "string",
        "apartment": "string",
        "category": "string",
        "fullAddress": "string"
      }
    ]
    ```
- **Example**:
    ```sh
    curl -X GET http://localhost:8000/api/users/addresses -H "Authorization: Bearer <JWT token>"
    ```

### Add Recent Search
- **Endpoint**: `POST /api/users/recent`
- **Description**: Add a recent search (requires authentication).
- **Request Body**:
    ```json
    {
      "fullAddress": "string"
    }
    ```
- **Response**:
    ```json
    {
      "message": "Recent search added successfully",
      "data": {
        "fullAddress": "string",
        "user": "userId",
        "createdAt": "date"
      }
    }
    ```
- **Example**:
    ```sh
    curl -X POST http://localhost:8000/api/users/recent -H "Authorization: Bearer <JWT token>" -H "Content-Type: application/json" -d '{"fullAddress": "123 Main St, City, State, 12345, Country"}'
    ```

### Get Recent Searches
- **Endpoint**: `GET /api/users/recent`
- **Description**: Get recent searches for the authenticated user.
- **Response**:
    ```json
    [
      "string"
    ]
    ```
- **Example**:
    ```sh
    curl -X GET http://localhost:8000/api/users/recent -H "Authorization: Bearer <JWT token>"
    ```

## Environment Variables
- `PORT`: The port on which the server will run (default: 8000).
- `MONGODB_URI`: The connection string for MongoDB.
- `JWT_SECRET`: The secret key for signing JWT tokens.

## Usage
1. Use the provided API endpoints to manage user authentication, addresses, and recent searches.
2. Ensure the frontend application is correctly configured to communicate with the backend server.

### Notes
- Ensure that the frontend and backend servers are running simultaneously for the application to function correctly.
- Update the `MONGODB_URI` and `JWT_SECRET` in the `.env` file with your actual MongoDB connection string and a secure JWT secret.
