const Training = require('../models/training.js');
const fs = require('fs');
const path = require('path');
const TrainingRequest = require('../models/TrainingRequest.js')

// Create a new training
const createTraining = async (req, res) => {
    try {
        const { description, title, date, places, type, audience, price } = req.body;
        const validTypes = ['paid', 'free', 'reduced'];
        const validAudiences = ['family and children', 'specialist'];

        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: `Invalid training type. Allowed values: ${validTypes.join(', ')}` });
        }

        if (!validAudiences.includes(audience)) {
            return res.status(400).json({ message: `Invalid audience. Allowed values: ${validAudiences.join(', ')}` });
        }

        if (type === 'paid' && (!price || isNaN(price) || price <= 0)) {
            return res.status(400).json({ message: 'Price must be a valid positive number for paid trainings.' });
        }

        const photo = req.file ? req.file.path : null;
        if (!photo) {
            return res.status(400).json({ message: 'Photo is required.' });
        }

        const training = await Training.create({
            description,
            photo,
            title,
            date,
            places,
            type,
            audience,
            price: type === 'free' ? 0 : price
        });

        res.status(201).json(training);
    } catch (error) {
        res.status(500).json({ message: 'Error creating training', error: error.message });
    }
};

// Get all trainings
const getAllTrainings = async (req, res) => {
    try {
        const trainings = await Training.find();
        res.status(200).json(trainings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving trainings', error: error.message });
    }
};

// Get training by ID
const getTrainingById = async (req, res) => {
    try {
        const { id } = req.params;
        const training = await Training.findById(id);

        if (!training) {
            return res.status(404).json({ message: 'Training not found' });
        }

        res.status(200).json(training);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving training', error: error.message });
    }
};

// Delete training by ID
const deleteTraining = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        // Fetch the training to be deleted
        const training = await Training.findById(id);
        if (!training) {
            return res.status(404).json({ message: 'Training not found' });
        }

        // Fetch associated training requests
        const associatedRequests = await TrainingRequest.find({ title: training.title });
        
        // Delete associated requests
        if (associatedRequests.length > 0) {
            await TrainingRequest.deleteMany({ title: training.title });
        }

        // Delete associated image if it exists
        const imagePath = training.photo;
        if (imagePath) {
            const filePath = path.join(__dirname, '../', imagePath);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting image:', err.message);
            });
        }

        // Delete the training
        const result = await Training.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Training not found' });
        }

        res.status(200).json({ message: 'Training and associated requests deleted successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error deleting training', error: error.message });
    }
};

// Delete all trainings
const deleteAllTrainings = async (req, res) => {
    try {
        await Training.deleteMany({});
        res.status(200).json({ message: "All trainings have been deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting trainings", error });
    }
};

// Update training
const updateTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, title, date, places, type, audience, price } = req.body;

        const validTypes = ['paid', 'free', 'reduced'];
        const validAudiences = ['family and children', 'specialist'];

        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: `Invalid training type. Allowed values: ${validTypes.join(', ')}` });
        }

        if (!validAudiences.includes(audience)) {
            return res.status(400).json({ message: `Invalid audience. Allowed values: ${validAudiences.join(', ')}` });
        }

        if (type === 'paid' && (!price || isNaN(price) || price <= 0)) {
            return res.status(400).json({ message: 'Price must be a valid positive number for paid trainings.' });
        }

        const photo = req.file ? req.file.path : null;
        const existingTraining = await Training.findById(id);
        if (!existingTraining) {
            return res.status(404).json({ message: 'Training not found.' });
        }

        existingTraining.description = description || existingTraining.description;
        existingTraining.title = title || existingTraining.title;
        existingTraining.date = date || existingTraining.date;
        existingTraining.places = places || existingTraining.places;
        existingTraining.type = type || existingTraining.type;
        existingTraining.audience = audience || existingTraining.audience;
        existingTraining.price = type === 'free' ? 0 : (price || existingTraining.price);

        if (photo) {
            existingTraining.photo = photo;
        }

        const updatedTraining = await existingTraining.save();
        res.status(200).json(updatedTraining);
    } catch (error) {
        res.status(500).json({ message: 'Error updating training', error: error.message });
    }
};

module.exports = {
    createTraining,
    getAllTrainings,
    getTrainingById,
    deleteTraining,
    deleteAllTrainings,
    updateTraining
};
