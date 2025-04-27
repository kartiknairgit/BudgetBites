document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        // If not logged in, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    console.log("Current user:", user);
    
    // Update user information display
    const usernameDisplay = document.getElementById('username-display');
    const vendorNameDisplay = document.getElementById('vendor-name-display');
    
    if (usernameDisplay) {
        usernameDisplay.textContent = user.username;
    }
    
    if (vendorNameDisplay) {
        vendorNameDisplay.textContent = user.username;
    }
    
    // Show the appropriate dashboard based on user type
    const customerDashboard = document.getElementById('customer-dashboard');
    const vendorDashboard = document.getElementById('vendor-dashboard');
    
    if (user.userType === 'vendor') {
        console.log("Showing vendor dashboard");
        customerDashboard.style.display = 'none';
        vendorDashboard.style.display = 'block';
        
        // Initialize vendor-specific data and functionality
        initVendorDashboard();
    } else {
        console.log("Showing customer dashboard");
        customerDashboard.style.display = 'block';
        vendorDashboard.style.display = 'none';
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear current user
            localStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
    
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real app, you would filter the food items here
            const filterValue = this.textContent.toLowerCase();
            console.log(`Filtering by: ${filterValue}`);
            
            // For now, we'll just log the filter value
            // In a real implementation, you would filter the items displayed
        });
    });
    
    // Add new listing button (for vendors)
    const addListingBtn = document.getElementById('add-listing-btn');
    
    if (addListingBtn) {
        addListingBtn.addEventListener('click', function() {
            // In a real app, this would open a modal or navigate to a form
            alert('This would open a form to add a new food listing.');
        });
    }
    
    // Handle food item actions (for customers)
    const addToCartButtons = document.querySelectorAll('#customer-dashboard .btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the food item details
            const foodItem = this.closest('.food-item');
            const foodTitle = foodItem.querySelector('.food-title').textContent;
            
            // In a real app, you would add the item to a cart
            alert(`Added "${foodTitle}" to your cart!`);
        });
    });
});