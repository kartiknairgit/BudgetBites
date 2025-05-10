document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    console.log("Current user:", user);

    const usernameDisplay = document.getElementById('username-display');
    const vendorNameDisplay = document.getElementById('vendor-name-display');

    if (usernameDisplay) usernameDisplay.textContent = user.username;
    if (vendorNameDisplay) vendorNameDisplay.textContent = user.username;

    const customerDashboard = document.getElementById('customer-dashboard');
    const vendorDashboard = document.getElementById('vendor-dashboard');

    if (user.userType === 'vendor') {
        console.log("Showing vendor dashboard");
        customerDashboard.style.display = 'none';
        vendorDashboard.style.display = 'block';
        if (typeof initVendorDashboard === 'function') initVendorDashboard();
    } else {
        console.log("Showing customer dashboard");
        customerDashboard.style.display = 'block';
        vendorDashboard.style.display = 'none';
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            console.log(`Filtering by: ${this.textContent.toLowerCase()}`);
        });
    });

    // Add Listing Modal
    const addListingBtn = document.getElementById('add-listing-btn');
    const addModal = document.getElementById('add-listing-modal');
    const closeAddModalBtn = document.getElementById('close-modal');
    const addListingForm = document.getElementById('add-listing-form');
    const listingsGrid = document.querySelector('.vendor-listings');
  

    if (addListingBtn && addModal) {
        addListingBtn.addEventListener('click', () => {
            addModal.style.display = 'block';
        });
    }

    if (closeAddModalBtn && addModal) {
        closeAddModalBtn.addEventListener('click', () => {
            addModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === addModal) addModal.style.display = 'none';
        if (e.target === editModal) editModal.style.display = 'none';
    });

    if (addListingForm && listingsGrid) {
        addListingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('food-name').value;
            const price = parseFloat(document.getElementById('food-price').value).toFixed(2);
            const originalPrice = parseFloat(document.getElementById('food-original-price').value).toFixed(2);
            const description = document.getElementById('food-description').value;
            const category = document.getElementById('food-category').value;

            const card = document.createElement('div');
            card.className = 'food-item';
            card.innerHTML = `
                <img src="/api/placeholder/300/200" alt="Food listing" class="food-img">
                <div class="food-info">
                    <div class="food-tags">
                        <span class="food-tag">${category}</span>
                    </div>
                    <h3 class="food-title">${name}</h3>
                    <div class="food-price">$${price} <span style="text-decoration: line-through; color: #999; font-size: 0.9rem;">$${originalPrice}</span></div>
                    <p class="food-description">${description}</p>
                    <div class="food-controls">
                        <button class="btn-sm btn-outline edit-btn">Edit</button>
                        <button class="btn-sm btn-outline">Pause</button>
                        <button class="btn-sm btn-outline delete-listing">Delete</button>
                    </div>
                </div>`;

            listingsGrid.appendChild(card);
            addListingForm.reset();
            addModal.style.display = 'none';
            attachEditEvent(card.querySelector('.edit-btn')); // Attach edit event to the new card
            attachDeleteEvent(card.querySelector('.delete-listing'));
        });
    }

    // Add to Cart
    const addToCartButtons = document.querySelectorAll('#customer-dashboard .btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const foodItem = this.closest('.food-item');
            const foodTitle = foodItem.querySelector('.food-title').textContent;
            alert(`Added "${foodTitle}" to your cart!`);
        });
    });

    const editModal = document.getElementById('edit-listing-modal');
    const closeEditModalBtn = document.getElementById('close-edit-modal');
    const editForm = document.getElementById('edit-listing-form');

    let currentEditItem = null; // To keep track of which item is being edited

    function attachEditEvent(button) {
        button.addEventListener('click', function () {
            currentEditItem = this.closest('.food-item');

            // Populate modal fields with current values
            const title = currentEditItem.querySelector('.food-title').textContent;
            const price = parseFloat(currentEditItem.querySelector('.food-price').childNodes[0].textContent.replace('$', ''));
            const originalPrice = parseFloat(currentEditItem.querySelector('.food-price span').textContent.replace('$', ''));
            const description = currentEditItem.querySelector('.food-description').textContent;

            document.getElementById('edit-food-name').value = title;
            document.getElementById('edit-food-price').value = price;
            document.getElementById('edit-food-original-price').value = originalPrice;
            document.getElementById('edit-food-description').value = description;

            // Show modal
            editModal.style.display = 'block';
        });
    }

    function attachDeleteEvent(button) {
        button.addEventListener('click', function () {
            const foodItem = this.closest('.food-item');
            foodItem.remove();
        });
    }

    // Attach edit/delete events to initial listings
    document.querySelectorAll('.edit-btn').forEach(attachEditEvent);
    document.querySelectorAll('.delete-listing').forEach(attachDeleteEvent);

    if (closeEditModalBtn && editModal) {
        closeEditModalBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!currentEditItem) return;

            // Get updated values
            const newName = document.getElementById('edit-food-name').value;
            const newPrice = parseFloat(document.getElementById('edit-food-price').value).toFixed(2);
            const newOriginalPrice = parseFloat(document.getElementById('edit-food-original-price').value).toFixed(2);
            const newDescription = document.getElementById('edit-food-description').value;

            // Update card content
            currentEditItem.querySelector('.food-title').textContent = newName;
            currentEditItem.querySelector('.food-price').innerHTML = `$${newPrice} <span style="text-decoration: line-through; color: #999; font-size: 0.9rem;">$${newOriginalPrice}</span>`;
            currentEditItem.querySelector('.food-description').textContent = newDescription;

            // Hide modal
            editModal.style.display = 'none';
            currentEditItem = null;
        });
    }
    // Pause/Unpause functionality
    document.querySelectorAll('.vendor-listings .food-item').forEach(item => {
        const pauseBtn = item.querySelector('.food-controls button:nth-child(2)');    
        pauseBtn.addEventListener('click', function () {
            item.classList.toggle('paused');
            if (item.classList.contains('paused')) {
                pauseBtn.textContent = 'Unpause';
            } else {
                pauseBtn.textContent = 'Pause';
            }
        });
    });
    const bars = document.querySelectorAll(".chart-bar");

    bars.forEach(bar => {
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.textContent = bar.getAttribute("data-revenue");
        bar.appendChild(tooltip);

        bar.addEventListener("mouseenter", () => {
            tooltip.style.opacity = 1;
        });

        bar.addEventListener("mousemove", (e) => {
            tooltip.style.left = e.offsetX + "px";
            tooltip.style.top = e.offsetY - 10 + "px";
        });

        bar.addEventListener("mouseleave", () => {
            tooltip.style.opacity = 0;
        });
    });
    

    let cart = [];

    document.querySelectorAll('.btn').forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            const foodItem = btn.closest('.food-item');
            const title = foodItem.querySelector('.food-title').innerText;
            const priceText = foodItem.querySelector('.food-price').innerText;
            const price = parseFloat(priceText.replace('$', ''));

            cart.push({ title, price });
            updateCartDisplay();
        });
    });
    // Open cart
    document.getElementById('cart-btn').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'flex';
        updateCartDisplay();
    });

    // Modal buttons
    document.getElementById('close-cart-btn').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
    });
    document.getElementById('proceed-btn').addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
        document.getElementById('checkout-form').style.display = 'flex';
    });
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('checkout-form').style.display = 'none';
    });

    // Submit order
    document.getElementById('submit-btn').addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const card = document.getElementById('card').value;
        if (!name || !card) {
        return alert('Please fill in payment details.');
        }
        document.getElementById('checkout-form').style.display = 'none';
        document.getElementById('order-success').style.display = 'flex';
        cart = [];
        updateCartDisplay();
        setTimeout(() => {
        document.getElementById('order-success').style.display = 'none';
        }, 3000);
    });

    function updateCartDisplay() {
        document.getElementById('cart-count').innerText = cart.length;
        
        const cartItemsList = document.getElementById('cart-items');
        cartItemsList.innerHTML = '';
        
        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerText = `${item.title} - $${item.price.toFixed(2)}`;
            cartItemsList.appendChild(li);
            total += item.price;
        });
        
        document.getElementById('cart-total').innerText = total.toFixed(2);
    }
    // document.getElementById('apply-filters').addEventListener('click', () => {
    //   const checked = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.value);

    //   document.querySelectorAll('.food-item').forEach(item => {
    //     const tagSpans = item.querySelectorAll('.food-tag');
    //     const tags = Array.from(tagSpans).map(tag => tag.textContent.trim());

    //     const priceText = item.querySelector('.food-price')?.textContent.trim().match(/\$([\d.]+)/);
    //     const price = priceText ? parseFloat(priceText[1]) : Infinity;

    //     let matches = false;

    //     for (const filter of checked) {
    //       if (filter === "Under5" && price < 5) {
    //         matches = true;
    //       } else if (tags.includes(filter)) {
    //         matches = true;
    //       }
    //     }

    //     item.style.display = (checked.length === 0 || matches) ? "" : "none";
    //   });
    // });
    document.getElementById('apply-filters').addEventListener('click', () => {
    const checked = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.value);

    document.querySelectorAll('.food-item').forEach(item => {
        const tagSpans = item.querySelectorAll('.food-tag');
        const tags = Array.from(tagSpans).map(tag => tag.textContent.trim());

        const priceText = item.querySelector('.food-price')?.textContent.trim().match(/\$([\d.]+)/);
        const price = priceText ? parseFloat(priceText[1]) : Infinity;

        let matches = false;

        for (const filter of checked) {
        if (filter === "Under5" && price < 5) {
            matches = true;
        } else if (filter === "Under7" && price < 7) {
            matches = true;
        } else if (tags.includes(filter)) {
            matches = true;
        }
        }

        item.style.display = (checked.length === 0 || matches) ? "" : "none";
    });
    });


});

