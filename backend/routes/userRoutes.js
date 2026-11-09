const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getUsers, getUserById, deleteUser } = require('../controllers/userController');
const { getProfile, updateProfile } = require('../controllers/authController');

// User profile shortcuts as required by specification
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin user management routes
router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
