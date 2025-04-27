// frontend/app.js
// DOM Elements
const homeLink = document.getElementById('home-link');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const dashboardLink = document.getElementById('dashboard-link');
const logoutLink = document.getElementById('logout-link');

const homeSection = document.getElementById('home-section');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const dashboardSection = document.getElementById('dashboard-section');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

const usernameDisplay = document.getElementById('username-display');
const emailDisplay = document.getElementById('email-display');

// API URL for backend
const API_URL = 'http://localhost:3000/api';

// Check if user is logged in (check local storage)
async function checkAuth() {
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            // Verify token with backend
            const response = await fetch(`${API_URL}/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                // User is authenticated
                usernameDisplay.textContent = userData.username;
                emailDisplay.textContent = userData.email;
                
                // Store user data
                localStorage.setItem('userData', JSON.stringify(userData));
            } else {
                // Token invalid or expired
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                usernameDisplay.textContent = 'Guest';
                emailDisplay.textContent = 'guest@example.com';
            }
        } catch (error) {
            console.error('Auth check error:', error);
            usernameDisplay.textContent = 'Guest';
            emailDisplay.textContent = 'guest@example.com';
        }
    } else {
        // No token, show as guest
        usernameDisplay.textContent = 'Guest';
        emailDisplay.textContent = 'guest@example.com';
    }
    
    // Check hash to navigate to the right section
    navigateToHashSection();
}

// Function to show a section based on hash
function navigateToHashSection() {
    // Get hash from URL (remove the # symbol)
    const hash = window.location.hash.substring(1);
    
    // Reset all active classes
    homeLink.classList.remove('active');
    loginLink.classList.remove('active');
    registerLink.classList.remove('active');
    dashboardLink.classList.remove('active');
    
    // Hide all sections
    homeSection.classList.add('hidden');
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    dashboardSection.classList.add('hidden');
    
    // Show section based on hash
    switch(hash) {
        case 'home':
            homeLink.classList.add('active');
            homeSection.classList.remove('hidden');
            break;
        case 'login':
            loginLink.classList.add('active');
            loginSection.classList.remove('hidden');
            break;
        case 'register':
            registerLink.classList.add('active');
            registerSection.classList.remove('hidden');
            break;
        case 'logout':
            // Handle logout
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            usernameDisplay.textContent = 'Guest';
            emailDisplay.textContent = 'guest@example.com';
            // Redirect to dashboard after logout
            window.location.hash = 'dashboard';
            break;
        case 'dashboard':
        default:
            dashboardLink.classList.add('active');
            dashboardSection.classList.remove('hidden');
            break;
    }
}

// Form Submissions
// Login Form
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        // Show loading state
        loginMessage.textContent = 'Logging in...';
        loginMessage.className = 'form-message';
        
        // Send login request to backend
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Successful login
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            // Show success message
            loginMessage.textContent = 'Login successful!';
            loginMessage.className = 'form-message success';
            
            // Reset form
            loginForm.reset();
            
            // Update user display
            usernameDisplay.textContent = data.user.username;
            emailDisplay.textContent = data.user.email;
            
            // Navigate to dashboard after delay
            setTimeout(() => {
                window.location.hash = 'dashboard';
            }, 1000);
        } else {
            // Show error message
            loginMessage.textContent = data.message || 'Login failed';
            loginMessage.className = 'form-message error';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginMessage.textContent = 'Error connecting to server';
        loginMessage.className = 'form-message error';
    }
});

// Register Form
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Check if passwords match
    if (password !== confirmPassword) {
        registerMessage.textContent = 'Passwords do not match';
        registerMessage.className = 'form-message error';
        return;
    }
    
    try {
        // Show loading state
        registerMessage.textContent = 'Creating account...';
        registerMessage.className = 'form-message';
        
        // Send register request to backend
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Successful registration
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            // Show success message
            registerMessage.textContent = 'Registration successful!';
            registerMessage.className = 'form-message success';
            
            // Reset form
            registerForm.reset();
            
            // Update user display
            usernameDisplay.textContent = data.user.username;
            emailDisplay.textContent = data.user.email;
            
            // Navigate to dashboard after delay
            setTimeout(() => {
                window.location.hash = 'dashboard';
            }, 1000);
        } else {
            // Show error message
            registerMessage.textContent = data.message || 'Registration failed';
            registerMessage.className = 'form-message error';
        }
    } catch (error) {
        console.error('Registration error:', error);
        registerMessage.textContent = 'Error connecting to server';
        registerMessage.className = 'form-message error';
    }
});

// Listen for hash changes to handle navigation
window.addEventListener('hashchange', navigateToHashSection);

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Default to dashboard if no hash is present
    if (!window.location.hash) {
        window.location.hash = 'dashboard';
    }
    checkAuth();
});