# Assignment 9.0 - Create, Retrieve, Update and Delete Users Using Express, MongoDB and Mongoose

## 1. Overview

This project is an Express.js application that connects to a local MongoDB database using Mongoose. It exposes four REST API endpoints that allow a client to create a new user, retrieve all stored users, update an existing user, and delete a user. The application demonstrates a structured approach to handling full CRUD operations in a Node.js backend by separating the schema, model, router, and server into distinct files.

## 2. Objective

The objective of this assignment is to extend basic MongoDB and Mongoose integration by implementing complete CRUD (Create, Read, Update, Delete) functionality. This includes defining a schema, creating a model from that schema, building API routes to insert, fetch, update, and delete data, and verifying that changes are correctly reflected in the database.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime for running the server |
| Express.js | Web framework used to build the REST API |
| MongoDB | NoSQL database used to store user data |
| Mongoose | ODM library used to model data and connect to MongoDB |
| Postman | Used to test the POST, GET, PATCH, and DELETE API endpoints |
| MongoDB Compass | Used to visually verify data stored in MongoDB |

## 4. Project Structure

```
assignment9.0/
│
├── server.js
├── schema/
│   └── userSchema.js
├── model/
│   └── userModel.js
├── router/
│   └── userRouter.js
├── screenshots/
│   ├── terminal.png
│   ├── postman_post.png
│   ├── postman_patch.png
│   └── postman_delete.png
└── Readme.md
```

**File and folder purpose:**

- `server.js` — Entry point of the application. Initializes Express, connects to MongoDB, registers middleware, and starts the server.
- `schema/userSchema.js` — Defines the structure and data types of a user document using Mongoose's `Schema` class.
- `model/userModel.js` — Compiles the schema into a Mongoose model, which is used to interact with the `users` collection in MongoDB.
- `router/userRouter.js` — Defines the API routes (`POST`, `GET`, `PATCH`, `DELETE`) and contains the logic for handling incoming requests.
- `screenshots/` — Contains proof-of-execution images for the terminal output and Postman requests.

## 5. Application Architecture

The application follows a simple layered flow, where each layer has a single responsibility:

```
Client/Postman
    → Express Server
        → Router
            → Mongoose Model
                → MongoDB
```

**Responsibility of each layer:**

- **Server** — Sets up the Express application, applies middleware, connects to the database, and mounts the router.
- **Router** — Receives incoming HTTP requests and directs them to the correct handler logic based on the route and method.
- **Model** — Acts as the interface between the router and MongoDB, built from the schema, and used to create, fetch, update, or delete documents.
- **Schema** — Defines what fields a user document should have and their data types.
- **Database (MongoDB)** — Physically stores the user data as documents inside a collection.

This layered structure keeps the database logic, route logic, and data definition separate, making the application easier to understand and maintain.

## 6. MongoDB Database

MongoDB is used as the database for this project, and Mongoose is used to connect the Node.js/Express application to it. Mongoose provides schema-based modeling, which allows the application to define a fixed structure for otherwise schema-less MongoDB documents.

- **Database name:** `userDB`
- **Collection name:** `users`
- **Connection string:** `mongodb://127.0.0.1:27017/userDB`
- **Data stored:** Basic user profile information, including name, email, age, and course.

When the server starts, Mongoose establishes a connection to the local MongoDB instance. A successful connection logs a confirmation message to the terminal, and any connection failure logs an appropriate error message.


### POST /api/users

- **URL:** `http://localhost:3000/api/users`
- **Method:** `POST`
- **Request Body:** JSON object containing `name`, `email`, `age`, and `course`
- **Purpose:** Accepts user data from the request body and stores it as a new document in the `users` collection.

**Example Request:**

```json
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "age": 22,
  "course": "MCA"
}
```

**Example Success Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "_id": "651f1e2b8f1b2c001c8e4a1a",
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "age": 22,
    "course": "MCA",
    "__v": 0
  }
}
```


### PATCH /api/users/:id

- **URL:** `http://localhost:3000/api/users/:id`
- **Method:** `PATCH`
- **URL Parameter:** `id` — the MongoDB `_id` of the user to update
- **Request Body:** JSON object containing only the fields that need to be updated
- **Purpose:** Updates the specified fields of an existing user document while leaving the remaining fields unchanged.

**Example URL:**

```
http://localhost:3000/api/users/651f1e2b8f1b2c001c8e4a1a
```

**Example Request Body:**

```json
{
  "age": 20,
  "course": "MCA"
}
```

**Example Success Response:**

```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "651f1e2b8f1b2c001c8e4a1a",
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "age": 20,
    "course": "MCA",
    "__v": 0
  }
}
```

### DELETE /api/users/:id

- **URL:** `http://localhost:3000/api/users/:id`
- **Method:** `DELETE`
- **URL Parameter:** `id` — the MongoDB `_id` of the user to delete
- **Request Body:** None required
- **Purpose:** Removes the complete user document matching the given `id` from the `users` collection.

**Example URL:**

```
http://localhost:3000/api/users/651f1e2b8f1b2c001c8e4a1a
```

**Example Success Response:**

```json
{
  "message": "User deleted successfully",
  "user": {
    "_id": "651f1e2b8f1b2c001c8e4a1a",
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "age": 20,
    "course": "MCA",
    "__v": 0
  }
}
```

The `_id` field is a unique identifier automatically generated by MongoDB for every document. The `__v` field is a version key automatically added by Mongoose to track document revisions internally; it does not need to be set or read manually.

## 7. Installation and Setup

1. Open the project folder (`assignment9.0`).
2. Initialize npm, if not already done:

   ```bash
   npm init -y
   ```

3. Install the required dependencies:

   ```bash
   npm install express mongoose
   ```

4. Ensure MongoDB is running locally on the default port.
5. Start the application:

   ```bash
   node server.js
   ```

**Expected terminal output:**

```
Server running on port 3000
MongoDB connected successfully
```

## 8. Testing With Postman

### POST Request

**URL:**
```
http://localhost:3000/api/users
```

**Body type:** raw → JSON

**Example Body:**

```json
{
  "name": "Laxman",
  "email": "blackeye@gmail.com",
  "age": 19,
  "course": "BTECH CSE"
}
```

A successful request returns a success message along with the newly inserted user document, including the MongoDB-generated `_id`.

### GET Request

**URL:**
```
http://localhost:3000/api/users
```

Sending this request returns all users currently stored in the database as a JSON array.

### PATCH Request

**URL:**
```
http://localhost:3000/api/users/:id
```

Replace `:id` with the actual MongoDB `_id` of the user to update.

**Body type:** raw → JSON

**Example Body:**

```json
{
  "age": 20,
  "course": "MCA"
}
```

Only the fields included in the request body are updated; all other fields remain unchanged. A successful request returns the updated user document.

### DELETE Request

**URL:**
```
http://localhost:3000/api/users/:id
```

Replace `:id` with the actual MongoDB `_id` of the user to delete. No request body is required. A successful request removes the document from the `users` collection and returns a confirmation message along with the deleted user data.

## 9. Verifying With MongoDB Compass

MongoDB Compass is used to visually inspect the `users` collection inside the `userDB` database before and after performing POST, PATCH, and DELETE operations, confirming that documents are correctly inserted, modified, or removed.

## 10. Screenshots Included

The following screenshots are included as proof of execution:

- `screenshots/terminal.png` — Shows the server startup output and successful MongoDB connection message.
- `screenshots/postman_post.png` — Shows a successful POST request in Postman with the inserted user response.
- `screenshots/postman_patch.png` — Shows a successful PATCH request in Postman with the updated user response.
- `screenshots/postman_delete.png` — Shows a successful DELETE request in Postman with the deletion confirmation response.

![Terminal Output](screenshots/terminal.png)
![POST Request](screenshots/postman_post.png)
![PATCH Request](screenshots/postman_patch.png)
![DELETE Request](screenshots/postman_delete.png)

## 11. Request-Response Flow

**POST Flow:**
```
Postman → Express → userRouter → User Model → MongoDB → Response
```


**PATCH Flow:**
```
Postman → Express → userRouter → User Model (find by id and update) → MongoDB → Response
```

**DELETE Flow:**
```
Postman → Express → userRouter → User Model (find by id and delete) → MongoDB → Response
```


## 12. Conclusion

This assignment demonstrates complete CRUD-based database interaction by implementing create, retrieve, update, and delete operations for user data using Express, Mongoose, and MongoDB. The project shows how a schema, model, and router can be organized into separate files to build a clean and maintainable API, with data persistence and modification verified through both Postman and MongoDB Compass.