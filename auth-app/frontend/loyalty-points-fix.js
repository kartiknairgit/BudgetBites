// Enhanced loyalty points fix - replaces the existing script
document.addEventListener('DOMContentLoaded', function() {
    console.log("Loyalty points fix loaded!");

    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        console.error("No user found in localStorage!");
        return;
    }

    // Initialize loyalty points if not already done
    if (!user.loyaltyPoints) {
        user.loyaltyPoints = 0;
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log("Initialized loyalty points to 0");
    }

    // Global cart variable reference (should be defined in original dashboard.js)
    let cart = window.cart || [];
    
    // CRITICAL FIX: Create a direct reference to the submit button
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) {
        console.error("Submit button not found!");
        return;
    }
    
    // CRITICAL FIX: Remove all existing click event listeners from the submit button
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
    
    // Add our new clean event listener
    newSubmitBtn.addEventListener('click', function() {
        console.log("Submit button clicked - loyalty points fix");
        
        // Basic validation
        const name = document.getElementById('name').value;
        const card = document.getElementById('card').value;
        
        if (!name || !card) {
            alert('Please fill in payment details.');
            return;
        }
        
        // Debug cart contents
        console.log("Current cart:", cart);
        
        // Directly access the cart items from the display if needed
        if (!cart || cart.length === 0) {
            const cartItems = document.getElementById('cart-items');
            if (cartItems && cartItems.children.length > 0) {
                console.log("Rebuilding cart from DOM elements");
                cart = [];
                Array.from(cartItems.children).forEach(item => {
                    const text = item.textContent;
                    const match = text.match(/(.+) - \$(\d+\.\d+)/);
                    if (match) {
                        cart.push({
                            title: match[1],
                            price: parseFloat(match[2])
                        });
                    }
                });
            }
        }
        
        // Calculate total amount for points
        let total = 0;
        if (cart && cart.length > 0) {
            cart.forEach(item => {
                if (item && typeof item.price !== 'undefined') {
                    const price = parseFloat(item.price);
                    if (!isNaN(price)) {
                        total += price;
                        console.log(`Added ${price} for ${item.title}`);
                    } else {
                        console.error(`Invalid price for item: ${item.title} - ${item.price}`);
                    }
                }
            });
        } else {
            // Fallback to the cart total displayed
            const cartTotal = document.getElementById('cart-total');
            if (cartTotal) {
                total = parseFloat(cartTotal.textContent);
                console.log("Using cart total from display:", total);
            }
        }
        
        console.log("Total purchase amount:", total);
        
        // Calculate loyalty points - 50 points per $10 spent
        const pointsEarned = Math.floor((total / 10) * 50);
        console.log("Points earned:", pointsEarned);
        
        // Add points to user's account
        user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsEarned;
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log("Updated loyalty points:", user.loyaltyPoints);
        
        // Update points display
        const pointsDisplay = document.getElementById('points-balance');
        if (pointsDisplay) {
            pointsDisplay.textContent = user.loyaltyPoints;
            console.log("Updated points display");
        }
        
        // Close checkout form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.style.display = 'none';
        }
        
        // Show success message with points
        const successElem = document.getElementById('order-success');
        if (successElem) {
            successElem.innerHTML = `✅ Order Placed!<br><span style="font-size: 1.2rem;">You earned ${pointsEarned} loyalty points!</span>`;
            successElem.style.display = 'flex';
            
            // Hide success message after delay
            setTimeout(() => {
                successElem.style.display = 'none';
            }, 4000);
        }
        
        // Clear cart
        cart = [];
        window.cart = cart; // Update global reference if it exists
        
        // Update cart display
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = '0';
        }
        
        const cartItems = document.getElementById('cart-items');
        if (cartItems) {
            cartItems.innerHTML = '';
        }
        
        const cartTotalDisplay = document.getElementById('cart-total');
        if (cartTotalDisplay) {
            cartTotalDisplay.textContent = '0.00';
        }
    });
    
    console.log("Loyalty points fix fully applied!");
});