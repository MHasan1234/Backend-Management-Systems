require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');


const app = express();


app.use(express.json()); 


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));