const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Read users from file
const getUsersFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write users to file
const writeUsersToFile = (users) => {
    try {
        fs.writeFileSync(
            path.join(__dirname, 'users.json'),
            JSON.stringify(users, null, 2),
            'utf8'
        );
        return true;
    } catch (error) {
        console.error('Error writing users to file:', error);
        return false;
    }
};

// Routes
app.post('/api/register', (req, res) => {
    const { username, email, password, userType } = req.body;
    
    // Validate input
    if (!username || !email || !password || !userType) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const users = getUsersFromFile();
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // In production, hash the password
        userType,
        createdAt: new Date().toISOString()
    };
    
    // Add user to file
    users.push(newUser);
    if (!writeUsersToFile(users)) {
        return res.status(500).json({ message: 'Failed to register user' });
    }
    
    // Generate token
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    // Return user and token (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword,
        token
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const users = getUsersFromFile();
    
    // Find user
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    
    // Return user and token (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
    });
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        
        req.user = user;
        next();
    });
};

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
    const users = getUsersFromFile();
    const user = users.find(user => user.id === req.user.id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dashboard.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});