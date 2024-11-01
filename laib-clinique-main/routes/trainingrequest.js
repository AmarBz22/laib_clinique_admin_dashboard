const express = require('express');
const {
  CreateTR,
  getAlltr,
  deleteTR,
  getTrainingByCourse,
  confirmTR,
  cancelRequest
} = require('../controllers/TrainingRequest');
const { getTrainingById } = require('../controllers/training');

const router = express.Router();

// Create a new training request
router.post('/create_trainingRequest', CreateTR);

// Get all training requests
router.get('/get_trainingRequest', getAlltr);

// Delete a training request by ID
router.delete('/delete_trainingRequest/:id', deleteTR);

// Get training requests by course title
router.get('/training_request_by_course/:title', getTrainingByCourse);

// Confirm a training request with both request ID and training ID
router.put('/trainingrequest/confirm/:requestId', confirmTR);

// Get a specific training by its ID
router.get('/training/:id', getTrainingById);

router.put('/cancelRequest/:requestId', cancelRequest);

module.exports = router;
