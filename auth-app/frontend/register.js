document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userType = document.querySelector('input[name="userType"]:checked').value;
        
        console.log("Registering new user:", { username, email, userType });
        
        // Simple client-side validation
        if (!username || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // For demo purposes: Store user in localStorage
        const users = JSON.parse(localStorage.getItem('budgetBitesUsers') || '[]');
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            alert('A user with this email already exists. Please try another email.');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password,
            userType,
            createdAt: new Date().toISOString()
        };
        
        // Add to users array and save
        users.push(newUser);
        localStorage.setItem('budgetBitesUsers', JSON.stringify(users));
        console.log("User saved:", newUser);
        
        // Set as current user
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    });
});