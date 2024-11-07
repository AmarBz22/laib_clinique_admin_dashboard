const express = require('express');
const router = express.Router();
const {
  getCompletedAppointmentStatistics,
  getCompletedSalesStatistics,
  getTrainingStatistics,
  getPendingOrders,
  getActiveCourses,
  getTotalAppointments
} = require('../controllers/statistics');

// Define routes
router.get('/completed-appointments', getCompletedAppointmentStatistics);
router.get('/completed-sales', getCompletedSalesStatistics);
router.get('/courseStatics', getTrainingStatistics);
router.get('/pending-orders', getPendingOrders); // New route for pending orders
router.get('/active-courses', getActiveCourses); // New route for active courses
router.get('/total-appointments', getTotalAppointments); // New route for total appointments

module.exports = router;
