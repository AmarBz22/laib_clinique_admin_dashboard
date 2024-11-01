// appointment.model.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // Use String to store time in HH:mm format

    // required: true,

  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Pending'], // Possible statuses
    default: 'Pending', // Default status
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
