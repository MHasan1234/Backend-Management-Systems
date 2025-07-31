const express = require('express');
const { applyForJob, getMyApplications, deleteApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all applications for the logged-in user
router.get('/', protect, getMyApplications);

// Apply for a job
router.post('/:jobId/apply', protect, applyForJob);

// Delete/withdraw an application
router.delete('/:id', protect, deleteApplication);

module.exports = router;