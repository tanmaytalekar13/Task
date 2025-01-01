# Frontend Application Endpoints Documentation

## Endpoints

### 1. `/` - Sign Up
- **Description**: Endpoint for user registration.
- **Method**: POST
- **Status Codes**:
  - `200 OK`: Successful sign-up.
  - `400 Bad Request`: Invalid input data.
  - `500 Internal Server Error`: Server error.
- **Required Data**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Example**:
  ```bash
  curl -X POST http://localhost:8000/api/users/signup -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
  ```

### 2. `/signin` - Sign In
- **Description**: Endpoint for user login.
- **Method**: POST
- **Status Codes**:
  - `200 OK`: Successful sign-in.
  - `401 Unauthorized`: Invalid credentials.
  - `500 Internal Server Error`: Server error.
- **Required Data**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Example**:
  ```bash
  curl -X POST http://localhost:8000/api/users/signin -H "Content-Type: application/json" -d '{"username": "testuser", "password": "password123"}'
  ```

### 3. `/home` - Home
- **Description**: Protected endpoint for the home page.
- **Method**: GET
- **Status Codes**:
  - `200 OK`: Successful access.
  - `401 Unauthorized`: User not authenticated.
- **Required Data**: None (Token required in localStorage).
- **Example**:
  ```bash
  curl -X GET http://localhost:8000/api/home -H "Authorization: Bearer <token>"
  ```

### 4. `/location` - Location
- **Description**: Endpoint for managing user locations.
- **Method**: GET
- **Status Codes**:
  - `200 OK`: Successful access.
  - `401 Unauthorized`: User not authenticated.
- **Required Data**: None (Token required in localStorage).
- **Example**:
  ```bash
  curl -X GET http://localhost:8000/api/location -H "Authorization: Bearer <token>"
  ```

### 5. `/address` - Delivery Address
- **Description**: Endpoint for setting delivery address.
- **Method**: POST
- **Status Codes**:
  - `200 OK`: Address saved successfully.
  - `400 Bad Request`: Invalid input data.
  - `401 Unauthorized`: User not authenticated.
  - `500 Internal Server Error`: Server error.
- **Required Data**:
  ```json
  {
    "house": "string",
    "apartment": "string",
    "category": "string",
    "fullAddress": "string"
  }
  ```
- **Example**:
  ```bash
  curl -X POST http://localhost:8000/api/users/address -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"house": "123", "apartment": "ABC Apartments", "category": "Home", "fullAddress": "123, ABC Apartments, XYZ Street, City, State, Country"}'
  ```

### 6. `/map` - Map
- **Description**: Protected endpoint for the map page.
- **Method**: GET
- **Status Codes**:
  - `200 OK`: Successful access.
  - `401 Unauthorized`: User not authenticated.
- **Required Data**: None (Token required in localStorage).
- **Example**:
  ```bash
  curl -X GET http://localhost:8000/api/map -H "Authorization: Bearer <token>"
  ```

## How to Use

1. **Sign Up**: Register a new user by sending a POST request to `/` with the required data.
2. **Sign In**: Log in an existing user by sending a POST request to `/signin` with the required data.
3. **Home**: Access the home page by navigating to `/home` (requires authentication).
4. **Location**: Manage user locations by navigating to `/location` (requires authentication).
5. **Delivery Address**: Set a delivery address by sending a POST request to `/address` with the required data (requires authentication).
6. **Map**: Access the map page by navigating to `/map` (requires authentication).

## Authentication

- Authentication is handled using tokens stored in localStorage.
- Ensure the token is present in localStorage for protected routes.

## Error Handling

- Proper error messages and status codes are returned for each endpoint.
- Handle errors gracefully in the frontend application.

## Notes

- Ensure the backend server is running and accessible at `http://localhost:8000`.
- Adjust the API endpoints and URLs as needed based on your backend configuration.