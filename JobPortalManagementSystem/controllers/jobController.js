const Job = require('../models/Job');

// List all jobs, with optional search by title
exports.getAllJobs = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};