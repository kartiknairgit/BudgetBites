document.addEventListener('DOMContentLoaded', function() {
    // First, let's ensure the demo accounts exist in localStorage
    const users = JSON.parse(localStorage.getItem('budgetBitesUsers') || '[]');
    
    // If no users exist yet, create demo accounts
    if (users.length === 0) {
        const demoAccounts = [
            {
                id: '123456',
                username: 'Demo User',
                email: 'demo@example.com',
                password: 'password',
                userType: 'customer'
            },
            {
                id: '123457',
                username: 'Demo Vendor',
                email: 'vendor@example.com',
                password: 'password',
                userType: 'vendor'
            }
        ];
        
        // Save demo accounts
        localStorage.setItem('budgetBitesUsers', JSON.stringify(demoAccounts));
        console.log('Demo accounts created');
    }

    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple client-side validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Get the latest user list
        const currentUsers = JSON.parse(localStorage.getItem('budgetBitesUsers') || '[]');
        const user = currentUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store logged in user
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Login failed. Please use either demo@example.com or vendor@example.com with password: password');
        }
    });
});