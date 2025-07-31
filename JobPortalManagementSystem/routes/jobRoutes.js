const express = require('express');
const { getAllJobs } = require('../controllers/jobController');
const router = express.Router();

// Public route to view and search jobs
router.get('/', getAllJobs);

module.exports = router;