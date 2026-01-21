const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret for JWT (In production, use .env)
const JWT_SECRET = 'super_secret_key_123';

// REGISTER
router.post('/register', async (req, res) => {
    // Check if user exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send({ message: 'Email already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        // Generate Token immediately for convenience
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        res.send({
            user: { id: user._id, name: user.name, email: user.email },
            token: token
        });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ message: 'Email is not found' });

    // Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ message: 'Invalid password' });

    // Create and assign token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    res.header('auth-token', token).send({
        token: token,
        user: { id: user._id, name: user.name, email: user.email }
    });
});

// FORGOT PASSWORD (MOCK)
router.post('/forgot-password', async (req, res) => {
    // In a real app, you would generate a reset token and email it.
    // Here we just check if email exists.
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ message: 'Email is not found' });

    // Mock success
    res.send({ message: 'Reset link sent to ' + req.body.email });
});

// Middleware for protected routes
const auth = require('../middleware/auth');

// GET USER PROFILE (Protected Route)
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).send({ message: 'User not found' });

        res.send({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// LOGOUT (Client-side token clearing)
router.post('/logout', (req, res) => {
    // Since JWT is stateless, logout is handled client-side by removing the token
    // This endpoint is just for confirmation/logging purposes
    res.send({ message: 'Logged out successfully' });
});

module.exports = router;
