// Common authentication functions
const API_URL = 'http://localhost:3000/api';

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Get user data from localStorage
function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Apply theme based on user role on every page
function applyUserTheme() {
    const userData = getUserData();
    console.log("Applying theme based on user data:", userData);
    if (userData) {
        // Remove any existing theme classes
        document.body.classList.remove('user-theme', 'host-theme');
        
        // Add appropriate theme class
        if (userData.role === 'host') {
            document.body.classList.add('host-theme');
            console.log('Applied host theme (red) for role:', userData.role);
        } else {
            document.body.classList.add('user-theme');
            console.log('Applied user theme (green) for role:', userData.role);
        }
    } else {
        // Default to user theme if not logged in
        document.body.classList.remove('host-theme');
        document.body.classList.add('user-theme');
        console.log('Applied default user theme (not logged in)');
    }
}

// Handle logout
document.getElementById('logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Redirect to home page
    window.location.href = 'index.html';
    
    // Alert user
    alert('You have been logged out successfully');
});

// Update navigation based on auth status
function updateNavigation() {
    const isAuthenticated = isLoggedIn();
    const logoutLink = document.getElementById('logout-link');
    
    if (isAuthenticated) {
        logoutLink.style.display = 'inline-block';
    } else {
        logoutLink.style.display = 'none';
    }
}

// Call when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    
    // Apply theme based on user role
    applyUserTheme();
    
    // Add debug information
    console.log('Auth status:', isLoggedIn() ? 'Logged in' : 'Not logged in');
    if (isLoggedIn()) {
        console.log('User data:', getUserData());
    }
});