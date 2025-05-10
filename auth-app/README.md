# BudgetBites

A web application for budget-friendly meal planning and tracking with user authentication.

## Project Structure

```
BudgetBites/auth-app/
├── backend/
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── users.json
├── frontend/
│   ├── app.js
│   ├── auth.js
│   ├── dashboard.html
│   ├── dashboard.js
│   ├── index.html
│   ├── login.html
│   ├── login.js
│   ├── register.html
│   ├── register.js
│   └── style.css
└── README.md
```

## Description

BudgetBites is a web application designed to help users manage their meal planning within a budget. The application features user authentication (registration, login) and a personalized dashboard.

## Features

- User registration and authentication
- Secure login system
- Personalized dashboard
- Budget tracking for meals
- Responsive design

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js
- **Data Storage**: JSON files (users.json)

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/kartiknairgit/BudgetBites.git
   cd BudgetBites/auth-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Start the server:
   ```
   node server.js
   ```

4. Access the application:
   Open `frontend/index.html` in your web browser

## Usage

1. **Registration**: Create a new account through the registration page
2. **Login**: Access your account using your credentials
3. **Dashboard**: View and manage your meal budget planning

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Authenticate a user
- `GET /api/user/:id` - Get user information

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Create a pull request

## License

[MIT License](LICENSE)

## Contact

- GitHub: [kartiknairgit](https://github.com/kartiknairgit)
