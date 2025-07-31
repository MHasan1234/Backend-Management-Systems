const Application = require('../models/Application');

// Create a new application for a job
exports.applyForJob = async (req, res) => {
  const { jobId } = req.params;
  const applicantId = req.user._id;

  try {
    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
    });
    res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (error) {
    // This will catch the duplicate key error from the index
    if (error.code === 11000) {
        return res.status(400).json({ message: 'You have already applied for this job.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all applications for the currently logged-in user
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id }).populate('job', 'title company');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete/withdraw an application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this application.' });
    }

    await application.deleteOne();
    res.json({ message: 'Application successfully deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};