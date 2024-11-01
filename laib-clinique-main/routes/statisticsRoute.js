const express = require('express');
const router = express.Router();
const {
  getCompletedAppointmentStatistics,
  getCompletedSalesStatistics,
} = require('../controllers/statistics');

// Define routes
router.get('/completed-appointments', getCompletedAppointmentStatistics);
router.get('/completed-sales', getCompletedSalesStatistics);

module.exports = router;
