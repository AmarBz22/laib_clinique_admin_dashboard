const express = require('express');
const {
    getAllTrainings,
    createTraining,
    getTrainingById,
    deleteTraining,

    deleteAllTrainings,
    updateTraining,
    getAllTrainingsClient
} = require('../controllers/training'); // Make sure the path is correct
const upload = require('../middlewares/upload'); // Multer configuration


const router = express.Router();

// Create a new training request
router.post('/create_training', upload.single('photo'), createTraining);


//update training
router.put('/update/:id', upload.single('photo'), updateTraining);

// Get all training requests
router.get('/get_training', getAllTrainings);

router.get('/get_training_client', getAllTrainingsClient)

// Get training by ID
router.get('/:id', getTrainingById);

// Delete a training request by ID
router.delete('/delete_training/:id', deleteTraining);

router.delete('/deleteAll',deleteAllTrainings)

module.exports = router;
