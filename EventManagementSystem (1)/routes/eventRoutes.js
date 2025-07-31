const express = require('express');
const {
  createEvent,
  getAllEvents,
  registerForEvent,
  cancelRegistration,
  approveEvent,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public route to view all approved events (with filtering)
router.get('/', getAllEvents);

// Protected routes for authenticated users
router.post('/', protect, createEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/cancel', protect, cancelRegistration);

// Protected routes for admins only
router.put('/:id/approve', protect, admin, approveEvent);

module.exports = router;