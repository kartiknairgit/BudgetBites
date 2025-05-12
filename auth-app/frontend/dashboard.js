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
    // Help Chat System
    const helpChatButton = document.getElementById('help-chat-button');
    const helpChatPanel = document.getElementById('help-chat-panel');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Common responses for frequently asked questions
    const helpResponses = {
        'filter': 'To filter products, select the checkboxes for categories like "Meals", "Groceries", or price ranges like "Under $5". Then click the "Apply Filters" button to show only matching items.',
        'checkout': 'To checkout, add items to your cart by clicking the "Add to Cart" button on products. Then click the cart icon in the navigation, review your order, and click "Proceed to Payment".',
        'payment': 'We accept all major credit cards. Your payment information is securely processed.',
        'return': 'For food quality issues, please contact the vendor directly through the vendor profile page. Refunds are processed within 24-48 hours.',
        'account': 'You can manage your account by clicking on "My Account" in the navigation menu. There you can update your profile, change your password, and view your order history.',
        'delivery': 'Delivery times vary by vendor. Estimated delivery times are shown during checkout before you confirm your order.',
        'help': 'I\'m here to help! Ask me any questions about using BudgetBites, and I\'ll do my best to assist you.',
        'default': 'I\'m not sure I understand. Could you try rephrasing your question? Or you can try one of the common questions below.'
    };

    // Toggle chat panel
    helpChatButton.addEventListener('click', () => {
        helpChatPanel.classList.toggle('active');
        helpChatButton.classList.remove('pulse'); // Remove pulse once clicked
    });

    closeChat.addEventListener('click', () => {
        helpChatPanel.classList.remove('active');
    });

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Process and respond
        setTimeout(() => {
            respondToMessage(message);
        }, 500);
    }

    // Send on button click
    sendChat.addEventListener('click', sendMessage);

    // Send on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle quick questions
    quickQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const questionText = question.textContent;
            addMessage(questionText, 'user');
            
            setTimeout(() => {
                respondToMessage(questionText);
            }, 500);
        });
    });

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = sender === 'user' ? 'You' : 'BB';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = text;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);

        // Auto scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Generate response based on message content
    function respondToMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = helpResponses.default;

        // Check for keywords in the message
        if (lowerMessage.includes('filter') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
            response = helpResponses.filter;
        } else if (lowerMessage.includes('checkout') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
            response = helpResponses.checkout;
        } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card')) {
            response = helpResponses.payment;
        } else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('money back')) {
            response = helpResponses.return;
        } else if (lowerMessage.includes('account') || lowerMessage.includes('profile') || lowerMessage.includes('password')) {
            response = helpResponses.account;
        } else if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping') || lowerMessage.includes('arrive')) {
            response = helpResponses.delivery;
        } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('assistance')) {
            response = helpResponses.help;
        } else if (lowerMessage.includes('how do i filter')) {
            response = helpResponses.filter;
        } else if (lowerMessage.includes('how does checkout work')) {
            response = helpResponses.checkout;
        } else if (lowerMessage.includes('return policy')) {
            response = helpResponses.return;
        }

        addMessage(response, 'assistant');
    }
        // Friends and Split Bill Feature
    let friends = [];
    let pendingFriendRequests = [];
    let pendingSplitRequests = [];

    // Mock data for demo purposes
    function initializeFriendSystem() {
        // Check if we have friends in local storage
        const storedFriends = localStorage.getItem('budgetBitesFriends');
        if (storedFriends) {
            friends = JSON.parse(storedFriends);
        } else {
            // Add some demo friends
            friends = [
                { id: 1, name: 'Alex Johnson', email: 'alex@example.com', avatar: 'AJ' },
                { id: 2, name: 'Morgan Smith', email: 'morgan@example.com', avatar: 'MS' }
            ];
            // Save to local storage
            localStorage.setItem('budgetBitesFriends', JSON.stringify(friends));
        }

        // Render friends
        renderFriends();

        // Simulate pending requests randomly for demo purposes
        setTimeout(() => {
            const randomRequest = Math.random() > 0.5;
            if (randomRequest) {
                pendingFriendRequests.push({
                    id: Date.now(),
                    name: 'Jordan Lee',
                    email: 'jordan@example.com',
                    avatar: 'JL'
                });
                showFriendRequestNotification();
            }
        }, 15000); // Show after 15 seconds for demo
    }

    // Render friends list
    function renderFriends() {
        const friendsList = document.getElementById('friends-list');
        const emptyMessage = document.querySelector('.empty-friends-message');
        
        if (friends.length === 0) {
            emptyMessage.style.display = 'block';
            return;
        }
        
        emptyMessage.style.display = 'none';
        friendsList.innerHTML = '';
        
        friends.forEach(friend => {
            const friendCard = document.createElement('div');
            friendCard.className = 'friend-card';
            friendCard.innerHTML = `
                <div class="friend-avatar">${friend.avatar}</div>
                <div class="friend-info">
                    <div class="friend-name">${friend.name}</div>
                    <div class="friend-email">${friend.email}</div>
                    <div class="friend-actions">
                        <button class="btn-sm share-cart" data-friend-id="${friend.id}">Share Cart</button>
                        <button class="btn-sm btn-outline remove-friend" data-friend-id="${friend.id}">Remove</button>
                    </div>
                </div>
            `;
            friendsList.appendChild(friendCard);
        });

        // Attach event listeners to new buttons
        document.querySelectorAll('.share-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const friendId = parseInt(e.target.dataset.friendId);
                shareCartWithFriend(friendId);
            });
        });

        document.querySelectorAll('.remove-friend').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const friendId = parseInt(e.target.dataset.friendId);
                removeFriend(friendId);
            });
        });
    }

    // Share cart with a friend
    function shareCartWithFriend(friendId) {
        const friend = friends.find(f => f.id === friendId);
        if (!friend) return;
        
        alert(`Cart shared with ${friend.name}! They'll receive a notification.`);
        
        // In a real app, you would send this to your backend
        console.log(`Shared cart with friend ID: ${friendId}`);
    }

    // Remove a friend
    function removeFriend(friendId) {
        if (confirm('Are you sure you want to remove this friend?')) {
            friends = friends.filter(friend => friend.id !== friendId);
            localStorage.setItem('budgetBitesFriends', JSON.stringify(friends));
            renderFriends();
        }
    }

    // Add Friend Modal Functionality
    const addFriendBtn = document.getElementById('add-friend-btn');
    const addFriendModal = document.getElementById('add-friend-modal');
    const closeFriendModalBtn = document.getElementById('close-friend-modal');
    const addFriendForm = document.getElementById('add-friend-form');

    if (addFriendBtn && addFriendModal) {
        addFriendBtn.addEventListener('click', () => {
            addFriendModal.style.display = 'block';
        });
    }

    if (closeFriendModalBtn) {
        closeFriendModalBtn.addEventListener('click', () => {
            addFriendModal.style.display = 'none';
        });
    }

    if (addFriendForm) {
        addFriendForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('friend-email').value;
            
            // Generate mock friend data (in a real app, this would send an invitation)
            const newFriend = {
                id: friends.length + 3, // simple ID generation for demo
                name: email.split('@')[0], // use part of email as name for demo
                email: email,
                avatar: email.substring(0, 2).toUpperCase()
            };
            
            // Add to friends list
            friends.push(newFriend);
            localStorage.setItem('budgetBitesFriends', JSON.stringify(friends));
            
            // Update UI
            renderFriends();
            addFriendModal.style.display = 'none';
            addFriendForm.reset();
            
            // Show success message
            alert(`Friend invitation sent to ${email}!`);
        });
    }

    // Split Bill Modal Functionality
    const splitBillBtn = document.getElementById('split-bill-btn');
    const splitBillModal = document.getElementById('split-bill-modal');
    const closeSplitModalBtn = document.getElementById('close-split-modal');
    const sendSplitRequestBtn = document.getElementById('send-split-request');

    if (splitBillBtn && splitBillModal) {
        splitBillBtn.addEventListener('click', () => {
            // Only allow splitting if there are items in cart
            if (cart.length === 0) {
                alert('Add items to your cart before splitting the bill.');
                return;
            }
            
            // Only allow splitting if there are friends
            if (friends.length === 0) {
                alert('Add friends before splitting the bill.');
                return;
            }
            
            // Display split bill modal
            updateSplitBillModal();
            splitBillModal.style.display = 'block';
        });
    }

    if (closeSplitModalBtn) {
        closeSplitModalBtn.addEventListener('click', () => {
            splitBillModal.style.display = 'none';
        });
    }

    // Update split bill modal content
    function updateSplitBillModal() {
        // Update cart items
        const splitCartItems = document.getElementById('split-cart-items');
        splitCartItems.innerHTML = '';
        
        let total = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.title} - $${item.price.toFixed(2)}`;
            splitCartItems.appendChild(li);
            total += item.price;
        });
        
        document.getElementById('split-cart-total').textContent = total.toFixed(2);
        
        // Update friends list for splitting
        const splitFriendsList = document.getElementById('split-friends-list');
        splitFriendsList.innerHTML = '';
        
        friends.forEach(friend => {
            const friendItem = document.createElement('div');
            friendItem.className = 'split-friend-item';
            friendItem.innerHTML = `
                <input type="checkbox" id="split-friend-${friend.id}" class="split-friend-checkbox" data-friend-id="${friend.id}">
                <div class="split-friend-avatar">${friend.avatar}</div>
                <label for="split-friend-${friend.id}">${friend.name}</label>
            `;
            splitFriendsList.appendChild(friendItem);
        });
        
        // Attach event listeners to checkboxes
        document.querySelectorAll('.split-friend-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateSplitCalculation);
        });
        
        // Initialize split calculation
        updateSplitCalculation();
    }

    // Update split calculation when checkboxes change
    function updateSplitCalculation() {
        const selectedFriends = document.querySelectorAll('.split-friend-checkbox:checked');
        const splitCount = selectedFriends.length + 1; // +1 for the current user
        
        document.getElementById('split-count').textContent = splitCount;
        
        // Calculate total
        let total = 0;
        cart.forEach(item => {
            total += item.price;
        });
        
        // Apply discount based on group size
        let discountPercent = 0;
        if (splitCount >= 3) {
            discountPercent = 10;
        } else if (splitCount >= 2) {
            discountPercent = 5;
        }
        
        document.getElementById('discount-amount').textContent = `${discountPercent}%`;
        
        // Apply discount
        if (discountPercent > 0) {
            total = total * (1 - (discountPercent / 100));
        }
        
        // Calculate per person amount
        const perPersonAmount = total / splitCount;
        document.getElementById('split-amount').textContent = perPersonAmount.toFixed(2);
    }

    // Send split request
    if (sendSplitRequestBtn) {
        sendSplitRequestBtn.addEventListener('click', () => {
            const selectedFriends = document.querySelectorAll('.split-friend-checkbox:checked');
            
            if (selectedFriends.length === 0) {
                alert('Select at least one friend to split with.');
                return;
            }
            
            // Get the split details
            const splitCount = selectedFriends.length + 1;
            const total = parseFloat(document.getElementById('split-cart-total').textContent);
            const discountPercent = parseInt(document.getElementById('discount-amount').textContent);
            const discountedTotal = discountPercent > 0 ? total * (1 - (discountPercent / 100)) : total;
            const perPersonAmount = discountedTotal / splitCount;
            
            // In a real app, this would send requests to the selected friends
            // For demo, just show a success message
            alert(`Split requests sent to ${selectedFriends.length} friends. Each person will pay $${perPersonAmount.toFixed(2)}.`);
            
            // Close the modal
            splitBillModal.style.display = 'none';
            
            // Simulate a pending split request after a few seconds for demo purposes
            setTimeout(() => {
                simulateIncomingSplitRequest();
            }, 10000);
        });
    }

    // Simulate an incoming split request (for demo purposes)
    function simulateIncomingSplitRequest() {
        const requestingFriend = friends[0]; // Use the first friend
        const splitAmount = 14.75; // Demo amount
        
        pendingSplitRequests.push({
            id: Date.now(),
            fromFriend: requestingFriend,
            amount: splitAmount,
            items: [
                { title: 'Fresh Vegetable Bundle', price: 6.99 },
                { title: 'Day-End Bread Assortment', price: 3.25 },
                { title: 'Student Lunch Box', price: 5.50 }
            ]
        });
        
        showSplitRequestNotification();
    }

    // Show friend request notification
    function showFriendRequestNotification() {
        if (pendingFriendRequests.length === 0) return;
        
        const request = pendingFriendRequests[0];
        const modal = document.getElementById('friend-notification-modal');
        const message = document.getElementById('friend-request-message');
        
        message.textContent = `${request.name} (${request.email}) has sent you a friend request.`;
        modal.style.display = 'block';
        
        // Set up accept/decline buttons
        document.getElementById('accept-friend').onclick = () => {
            acceptFriendRequest(request);
            modal.style.display = 'none';
        };
        
        document.getElementById('decline-friend').onclick = () => {
            declineFriendRequest(request);
            modal.style.display = 'none';
        };
        
        document.getElementById('close-notification-modal').onclick = () => {
            modal.style.display = 'none';
        };
    }

    // Show split request notification
    function showSplitRequestNotification() {
        if (pendingSplitRequests.length === 0) return;
        
        const request = pendingSplitRequests[0];
        const modal = document.getElementById('split-notification-modal');
        const message = document.getElementById('split-request-message');
        const items = document.getElementById('split-request-items');
        const amount = document.getElementById('split-request-amount');
        
        message.textContent = `${request.fromFriend.name} has sent you a split bill request.`;
        items.innerHTML = '';
        
        request.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.title} - $${item.price.toFixed(2)}`;
            items.appendChild(li);
        });
        
        amount.textContent = request.amount.toFixed(2);
        modal.style.display = 'block';
        
        // Set up accept/decline buttons
        document.getElementById('accept-split').onclick = () => {
            acceptSplitRequest(request);
            modal.style.display = 'none';
        };
        
        document.getElementById('decline-split').onclick = () => {
            declineSplitRequest(request);
            modal.style.display = 'none';
        };
        
        document.getElementById('close-split-notification-modal').onclick = () => {
            modal.style.display = 'none';
        };
    }

    // Accept friend request
    function acceptFriendRequest(request) {
        friends.push({
            id: request.id,
            name: request.name,
            email: request.email,
            avatar: request.avatar
        });
        
        localStorage.setItem('budgetBitesFriends', JSON.stringify(friends));
        renderFriends();
        
        pendingFriendRequests = pendingFriendRequests.filter(req => req.id !== request.id);
        alert(`You are now friends with ${request.name}!`);
    }

    // Decline friend request
    function declineFriendRequest(request) {
        pendingFriendRequests = pendingFriendRequests.filter(req => req.id !== request.id);
        alert(`Friend request from ${request.name} declined.`);
    }

    // Accept split request
    function acceptSplitRequest(request) {
        pendingSplitRequests = pendingSplitRequests.filter(req => req.id !== request.id);
        alert(`You've paid your share of $${request.amount.toFixed(2)}!`);
        
        // Show success message
        document.getElementById('order-success').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('order-success').style.display = 'none';
        }, 3000);
    }

    // Decline split request
    function declineSplitRequest(request) {
        pendingSplitRequests = pendingSplitRequests.filter(req => req.id !== request.id);
        alert(`Split request from ${request.fromFriend.name} declined.`);
    }

    // Initialize the friend system when the page loads
    initializeFriendSystem();

        // Nutrition Facts Toggle Functionality
    function initializeNutritionToggles() {
        // Sample nutrition data for each food item
        const nutritionData = {
            "Vegetable Pasta Bowl": {
                calories: 320,
                totalFat: "8g",
                saturatedFat: "1.5g",
                cholesterol: "0mg",
                sodium: "580mg",
                totalCarbs: "52g",
                dietaryFiber: "7g",
                sugars: "6g",
                protein: "12g",
                badges: ["vegetarian", "low-fat", "high-fiber"]
            },
            "Fresh Vegetable Bundle": {
                calories: 150,
                totalFat: "2g",
                saturatedFat: "0g",
                cholesterol: "0mg",
                sodium: "30mg",
                totalCarbs: "30g",
                dietaryFiber: "8g",
                sugars: "12g",
                protein: "5g",
                badges: ["vegetarian", "vegan", "low-fat"]
            },
            "Day-End Bread Assortment": {
                calories: 280,
                totalFat: "4g",
                saturatedFat: "0.5g",
                cholesterol: "0mg",
                sodium: "450mg",
                totalCarbs: "52g",
                dietaryFiber: "3g",
                sugars: "8g",
                protein: "9g",
                badges: ["vegetarian"]
            },
            "Student Lunch Box": {
                calories: 520,
                totalFat: "18g",
                saturatedFat: "5g",
                cholesterol: "45mg",
                sodium: "820mg",
                totalCarbs: "65g",
                dietaryFiber: "5g",
                sugars: "22g",
                protein: "24g",
                badges: []
            },
            "Quinoa & Roasted Vegetable Bowl": {
                calories: 380,
                totalFat: "12g",
                saturatedFat: "1.5g",
                cholesterol: "0mg",
                sodium: "320mg",
                totalCarbs: "58g",
                dietaryFiber: "12g",
                sugars: "8g",
                protein: "14g",
                badges: ["vegetarian", "vegan", "gluten-free", "high-fiber"]
            },
            "Budget Vegetarian Curry Bowl": {
                calories: 410,
                totalFat: "14g",
                saturatedFat: "6g",
                cholesterol: "0mg",
                sodium: "680mg",
                totalCarbs: "62g",
                dietaryFiber: "9g",
                sugars: "10g",
                protein: "12g",
                badges: ["vegetarian"]
            },
            "Pasta & Sauce Kit": {
                calories: 350,
                totalFat: "3g",
                saturatedFat: "0.5g",
                cholesterol: "0mg",
                sodium: "520mg",
                totalCarbs: "68g",
                dietaryFiber: "4g",
                sugars: "12g",
                protein: "12g",
                badges: ["vegetarian", "low-fat"]
            },
            "Spicy Chickpea Wrap": {
                calories: 430,
                totalFat: "18g",
                saturatedFat: "2g",
                cholesterol: "0mg",
                sodium: "600mg",
                totalCarbs: "52g",
                dietaryFiber: "9g",
                sugars: "5g",
                protein: "14g",
                badges: ["vegan", "high-fiber", "spicy"]
            }
        };

        // Get all food items
        const foodItems = document.querySelectorAll('.food-item');
        
        // For each food item, add the nutrition button and overlay
        foodItems.forEach(item => {
            const foodTitle = item.querySelector('.food-title').textContent;
            const foodInfo = item.querySelector('.food-info');
            
            // Add the nutrition toggle button if it doesn't exist
            if (!item.querySelector('.nutrition-toggle')) {
                // Create button
                const nutritionButton = document.createElement('button');
                nutritionButton.className = 'btn-sm btn-outline nutrition-toggle';
                nutritionButton.innerHTML = '<span class="nutrition-icon">🍎</span> Nutrition Facts';
                
                // Insert before the Add to Cart button
                const addToCartBtn = item.querySelector('.btn');
                if (addToCartBtn) {
                    foodInfo.insertBefore(nutritionButton, addToCartBtn);
                }
                
                // Create nutrition overlay
                const nutritionOverlay = document.createElement('div');
                nutritionOverlay.className = 'nutrition-overlay';
                
                // Get nutrition data for this food item
                const nutrition = nutritionData[foodTitle] || {
                    calories: "N/A",
                    totalFat: "N/A",
                    saturatedFat: "N/A",
                    cholesterol: "N/A",
                    sodium: "N/A",
                    totalCarbs: "N/A",
                    dietaryFiber: "N/A",
                    sugars: "N/A",
                    protein: "N/A",
                    badges: []
                };
                
                // Create badges HTML
                let badgesHTML = '';
                nutrition.badges.forEach(badge => {
                    const badgeText = badge.replace('-', ' ');
                    badgesHTML += `<div class="nutrition-badge ${badge}">${badgeText}</div>`;
                });
                
                // Populate the overlay
                nutritionOverlay.innerHTML = `
                    <div class="nutrition-header">
                        <h4>Nutrition Facts</h4>
                        <button class="close-nutrition">&times;</button>
                    </div>
                    <div class="nutrition-content">
                        <div class="nutrition-item">
                            <span class="nutrition-label">Calories</span>
                            <span class="nutrition-value">${nutrition.calories}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Total Fat</span>
                            <span class="nutrition-value">${nutrition.totalFat}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Saturated Fat</span>
                            <span class="nutrition-value">${nutrition.saturatedFat}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Cholesterol</span>
                            <span class="nutrition-value">${nutrition.cholesterol}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Sodium</span>
                            <span class="nutrition-value">${nutrition.sodium}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Total Carbs</span>
                            <span class="nutrition-value">${nutrition.totalCarbs}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Dietary Fiber</span>
                            <span class="nutrition-value">${nutrition.dietaryFiber}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Sugars</span>
                            <span class="nutrition-value">${nutrition.sugars}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Protein</span>
                            <span class="nutrition-value">${nutrition.protein}</span>
                        </div>
                        <div class="nutrition-footer">
                            ${badgesHTML}
                        </div>
                    </div>
                `;
                
                // Add the overlay to the food item
                foodInfo.appendChild(nutritionOverlay);
                
                // Add click event for the button
                nutritionButton.addEventListener('click', (e) => {
                    console.log("Nutrition button clicked!");
                    e.preventDefault();
                    e.stopPropagation();
                    nutritionOverlay.style.display = 'block';
                });
                
                // Add click event for the close button
                nutritionOverlay.querySelector('.close-nutrition').addEventListener('click', (e) => {
                    console.log("Close nutrition button clicked!");
                    e.preventDefault();
                    e.stopPropagation();
                    nutritionOverlay.style.display = 'none';
                });
            }
        });
    }

    initializeNutritionToggles();
    
    // Add this to your existing DOMContentLoaded event listener

    // Price Alert Functionality
    const alertButtons = document.querySelectorAll('.set-alert-btn');
    const alertModal = document.getElementById('price-alert-modal');
    const closeAlertModalBtn = document.getElementById('close-alert-modal');
    const alertForm = document.getElementById('price-alert-form');
    let currentItemForAlert = null;

    // Set up alerts container
    const alertsContainer = document.createElement('div');
    alertsContainer.className = 'alerts-container';
    document.body.appendChild(alertsContainer);

    // Show previously set alerts on page load
    function showExistingAlerts() {
        const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
        
        // Add badges to items with alerts
        document.querySelectorAll('.food-item').forEach(item => {
            const title = item.querySelector('.food-title').textContent;
            const matchingAlert = alerts.find(alert => alert.title === title);
            
            if (matchingAlert) {
                // Add alert badge if doesn't exist already
                if (!item.querySelector('.price-alert-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'price-alert-badge';
                    badge.innerHTML = `🔔 $${matchingAlert.targetPrice}`;
                    item.appendChild(badge);
                }
            }
        });
    }

    // Init alert buttons
    alertButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const foodItem = button.closest('.food-item');
            const title = foodItem.querySelector('.food-title').textContent;
            const priceText = foodItem.querySelector('.food-price').textContent;
            const currentPrice = parseFloat(priceText.match(/\$(\d+\.\d+)/)[1]);
            
            // Set form values
            document.getElementById('alert-item-title').value = title;
            document.getElementById('alert-current-price').value = currentPrice;
            document.getElementById('alert-price').value = (currentPrice * 0.9).toFixed(2); // Default to 10% less
            
            // Keep track of current item
            currentItemForAlert = foodItem;
            
            // Show modal
            alertModal.style.display = 'flex';
        });
    });

    // Close modal
    if (closeAlertModalBtn) {
        closeAlertModalBtn.addEventListener('click', () => {
            alertModal.style.display = 'none';
        });
    }

    // Handle click outside modal
    window.addEventListener('click', (e) => {
        if (e.target === alertModal) {
            alertModal.style.display = 'none';
        }
    });

    // Handle alert form submission
    if (alertForm) {
        alertForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('alert-item-title').value;
            const currentPrice = parseFloat(document.getElementById('alert-current-price').value);
            const targetPrice = parseFloat(document.getElementById('alert-price').value);
            
            // Validate
            if (targetPrice >= currentPrice) {
                alert('Target price must be lower than the current price.');
                return;
            }
            
            // Save alert
            const newAlert = {
                title,
                currentPrice,
                targetPrice,
                createdAt: new Date().toISOString()
            };
            
            const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
            
            // Check if alert for this item already exists
            const existingAlertIndex = alerts.findIndex(alert => alert.title === title);
            if (existingAlertIndex !== -1) {
                alerts[existingAlertIndex] = newAlert;
            } else {
                alerts.push(newAlert);
            }
            
            localStorage.setItem('priceAlerts', JSON.stringify(alerts));
            
            // Add badge to item
            if (currentItemForAlert) {
                // Remove existing badge if any
                const existingBadge = currentItemForAlert.querySelector('.price-alert-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }
                
                // Add new badge
                const badge = document.createElement('div');
                badge.className = 'price-alert-badge';
                badge.innerHTML = `🔔 $${targetPrice.toFixed(2)}`;
                currentItemForAlert.appendChild(badge);
            }
            
            // Show confirmation
            showAlertNotification(`Alert set for ${title}`, `We'll notify you when price drops below $${targetPrice.toFixed(2)}`);
            
            // Reset and close modal
            alertForm.reset();
            alertModal.style.display = 'none';
        });
    }

    // Show notification
    function showAlertNotification(title, message, action = null) {
        const notification = document.createElement('div');
        notification.className = 'alert-notification';
        
        let actionHtml = '';
        if (action) {
            actionHtml = `<div class="alert-notification-action">${action}</div>`;
        }
        
        notification.innerHTML = `
            <div class="alert-notification-title">${title}</div>
            <div class="alert-notification-message">${message}</div>
            ${actionHtml}
        `;
        
        alertsContainer.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-100%)';
            notification.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Check for triggered alerts when prices update
    function checkPriceAlerts() {
        const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
        
        document.querySelectorAll('.food-item').forEach(item => {
            const title = item.querySelector('.food-title').textContent;
            const priceText = item.querySelector('.food-price').textContent;
            const currentPrice = parseFloat(priceText.match(/\$(\d+\.\d+)/)[1]);
            
            const matchingAlert = alerts.find(alert => alert.title === title);
            
            if (matchingAlert && currentPrice <= matchingAlert.targetPrice) {
                // Price target reached! Notify user
                showAlertNotification(
                    '🎉 Price Alert Triggered!',
                    `${title} is now $${currentPrice.toFixed(2)}, below your target of $${matchingAlert.targetPrice.toFixed(2)}`,
                    `<button class="btn-sm" onclick="addToCartById('${title}')">Add to Cart</button>`
                );
                
                // Remove the alert
                const updatedAlerts = alerts.filter(alert => alert.title !== title);
                localStorage.setItem('priceAlerts', JSON.stringify(updatedAlerts));
                
                // Remove the badge
                const badge = item.querySelector('.price-alert-badge');
                if (badge) {
                    badge.remove();
                }
            }
        });
    }

    // Helper function to add item to cart by title (for alert notifications)
    function addToCartById(title) {
        document.querySelectorAll('.food-item').forEach(item => {
            if (item.querySelector('.food-title').textContent === title) {
                const addBtn = item.querySelector('.btn');
                if (addBtn) {
                    addBtn.click();
                }
            }
        });
    }

    // Initialize alerts on page load
    showExistingAlerts();

    // Check for triggered alerts periodically (every minute)
    setInterval(checkPriceAlerts, 60000);

    // Add this function to dynamically add price alert buttons to all food items
        function addPriceAlertButtons() {
            document.querySelectorAll('.food-item').forEach(item => {
                // Skip if it already has a price alert button
                if (item.querySelector('.set-alert-btn')) {
                    return;
                }
                
                // Find the Add to Cart button
                const addToCartBtn = item.querySelector('.btn');
                if (addToCartBtn) {
                    // Create the alert button
                    const alertBtn = document.createElement('button');
                    alertBtn.className = 'btn-sm btn-outline set-alert-btn';
                    alertBtn.innerHTML = '<span class="alert-icon">🔔</span> Set Price Alert';
                    
                    // Insert after Add to Cart button
                    addToCartBtn.insertAdjacentElement('afterend', alertBtn);
                }
            });
        }

        // Call the function to add price alert buttons to all food items
        addPriceAlertButtons();

});


