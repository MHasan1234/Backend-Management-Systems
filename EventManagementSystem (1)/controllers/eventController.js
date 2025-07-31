const Event = require('../models/Event');

// User creates an event (status will be 'pending')
exports.createEvent = async (req, res) => {
  const { title, description, date, time, location, capacity } = req.body;
  try {
    const event = await Event.create({
      title, description, date, time, location, capacity,
      createdBy: req.user._id,
    });
    res.status(201).json({ message: 'Event created and awaiting approval.', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// View all events (filtered, only shows 'approved' to non-admins)
exports.getAllEvents = async (req, res) => {
  const { date, location } = req.query;
  const filter = {};
  if (date) filter.date = { $gte: new Date(date) };
  if (location) filter.location = { $regex: location, $options: 'i' };

  // Non-admins can only see approved events
  if (!req.user || req.user.role !== 'admin') {
    filter.status = 'approved';
  }

  try {
    const events = await Event.find(filter).populate('createdBy', 'username');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User registers for an event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.status !== 'approved') {
      return res.status(404).json({ message: 'Event not found or not available' });
    }
    if (event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }
    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    event.registeredUsers.push(req.user._id);
    await event.save();
    res.json({ message: 'Successfully registered for the event' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User cancels their registration
exports.cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userIndex = event.registeredUsers.indexOf(req.user._id);
    if (userIndex === -1) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    event.registeredUsers.splice(userIndex, 1);
    await event.save();
    res.json({ message: 'Registration successfully cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin approves an event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.status = 'approved';
    await event.save();
    res.json({ message: 'Event approved successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};