# Budget Bites

A food retail platform for students and low-income households to find affordable food options.

## How to Run the App

1. Navigate to the `frontend` directory
2. Run a simple HTTP server:
   ```
   python3 -m http.server
   ```
3. Open your browser and go to: `http://localhost:8000`

## Demo Credentials

For quick access, you can use these demo credentials:

**Customer Account:**
- Email: demo@example.com
- Password: password

**Vendor Account:**
- Email: vendor@example.com
- Password: password

## Features

- Welcome page with animated text
- User authentication (login/registration)
- Customer dashboard to browse food items
- Vendor dashboard to manage food listings
  - View analytics and orders
  - Add, edit, and delete food items
  - Notification system
- Responsive design for all screen sizes

## Vendor Dashboard Features

As a vendor, you can:
- View your active listings, order statistics, and revenue data
- See a weekly revenue chart
- Track recent orders
- Add new food listings through a modal form
- Manage existing listings (edit, pause, delete)
- Receive notifications for new orders and reviews

## Technology

- HTML/CSS/JavaScript for frontend
- Client-side storage (localStorage) for user data

## File Structure

- `index.html` - Welcome page with animation
- `login.html` - User login page
- `register.html` - User registration page
- `dashboard.html` - Main application dashboard
- `style.css` - Global styles
- Various JavaScript files for functionality

## Notes

This is a simplified version that works without a backend server. In a production environment, you would need to implement proper server-side authentication and data storage.