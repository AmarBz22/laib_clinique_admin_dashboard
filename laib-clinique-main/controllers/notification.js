const Notification = require('../models/notification'); // Adjust the path as necessary

// Endpoint to get all non-seen notifications
exports.getNonSeenNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ seen: false }).sort({ createdAt: -1 });

        res.status(200).json(notifications); // Send the notifications in the response
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve notifications', error: error.message });
    }
};

exports.markNotificationAsSeen = async (req, res) => {
    const { id } = req.params; // Extract ID from request parameters

    try {
        // Update the notification to mark it as seen
        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            { seen: true }, // Set seen to true
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(updatedNotification); 
    } catch (error) {
        res.status(500).json({ message: 'Failed to update notification', error: error.message });
    }
};