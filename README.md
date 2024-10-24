# AST Rules Project

## Overview

The **AST Rules Project** is a web application that allows users to create, manage, and evaluate rules using Abstract Syntax Trees (AST). The application is built using the MERN stack, which includes MongoDB for data storage, Express.js as the backend framework, React for the frontend, and Node.js as the runtime environment. This project enables users to input rule strings, combine them into a single AST, and evaluate user data against the combined AST.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Backend API Endpoints](#backend-api-endpoints)
- [Frontend Overview](#frontend-overview)
- [Testing](#testing)
- [Contributing](#contributing)

## Features

- **Rule Creation:** Users can input new rule strings to create rules.
- **Rule Combination:** Users can combine multiple rules into a single AST using logical OR.
- **Rule Evaluation:** Evaluate user data against the combined AST to check if it meets at least one rule.
- **Modification of Rules:** Modify existing rules, changing operators, operand values, or adding/removing sub-expressions.
- **User-friendly Frontend:** A responsive React application that allows for easy interaction with the rule engine.

## Technologies Used

- **Frontend:**

  - React
  - Axios
  - CSS3

- **Backend:**

  - Node.js
  - Express.js
  - Mongoose (MongoDB ODM)

- **Database:**
  - MongoDB (local storage)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>

   ```

2. Navigate to the project directory:
   cd ast-rules

3. Install dependencies:
   . For the backend:
   cd backend
   npm install
   . For the frontend:
   cd frontend
   npm install

4. Start the backend server:
   cd backend
   node server.js

5. Start the frontend server:
   cd frontend
   npm start

## Usage

Open your browser and navigate to http://localhost:3000 to access the application.
Use the provided input fields to create new rules, combine them, and evaluate user data against the rules.
View results displayed in a structured format.

## Backend API Endpoints

POST /api/rules : Create a new rule.
GET /api/rules : Retrieve all rules.
POST /api/evaluate : Evaluate user data against combined rules.

## Frontend Overview

The frontend provides an interactive user interface to input rule strings, combine rules, and evaluate them. Users can see the results of their evaluations and modify existing rules easily.

## Testing

The AST Rules Project includes a set of tests to ensure the functionality and reliability of the application.
The backend tests are located in the backend/test directory and are written using Mocha and Chai.
To run the backend tests, navigate to the backend directory and execute:
npm test

The tests cover various functionalities, including:

Rule creation
Rule modification
Rule evaluation

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure your code is well-documented and tested.

![Screenshot 2024-10-24 203254](https://github.com/user-attachments/assets/bafc652e-207f-4e0a-a82e-331daa2e5b25)
