const mongoose = require('mongoose');

// Define the Notification schema
const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true, // Indicates that this field is required
        enum: ['Order', 'Appointment', 'Training Request'], // Optional: Limit the values for type
    },
    username: {
        type: String,
        required: true, // Indicates that this field is required
    },
    id: {
        type: String, 
        required: true, // Indicates that this field is required
    },
    seen: {
        type: Boolean, // Change here: id is now a string
        default:false,
    },
}, {
    timestamps: true, // Automatically create createdAt and updatedAt fields
});

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
