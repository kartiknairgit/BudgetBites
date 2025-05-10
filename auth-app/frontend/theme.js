document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return; // Exit if toggle button doesn't exist
    
    const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
    const themeText = themeToggle.querySelector('.theme-toggle-text');

    // Check for saved theme preference or use default dark theme
    const savedTheme = localStorage.getItem('budgetBitesTheme') || 'dark';

    // Apply saved theme on page load
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
    } else {
        document.body.classList.remove('light-mode');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    }

    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default action if it's an <a> tag
        
        if (document.body.classList.contains('light-mode')) {
            // Switch to dark mode
            document.body.classList.remove('light-mode');
            localStorage.setItem('budgetBitesTheme', 'dark');
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light Mode';
        } else {
            // Switch to light mode
            document.body.classList.add('light-mode');
            localStorage.setItem('budgetBitesTheme', 'light');
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark Mode';
        }
    });
});