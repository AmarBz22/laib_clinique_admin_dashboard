const express = require('express');
const { createAppointment ,addAppointmentAdmin, getAllAppointments , deleteAppointment ,deleteAllAppointments, getRecentAppointments ,getAppointmentById, confirmAppointment,cancelAppointment, deleteAppointmentById,completeAppointment, updateAppointmentDateTime} = require('../controllers/appointment');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/create_appointment' ,createAppointment);
router.post('/create_appointment_admin', addAppointmentAdmin);

router.get('/get_appointment', getAllAppointments);
router.get('/:id',getAppointmentById)
router.delete('/delete_appointment', deleteAppointment);
router.get ('/recent_appointemnt',getRecentAppointments)
router.delete('/delete_all_appointments', deleteAllAppointments); // New route
router.put('/confirm/:id',confirmAppointment);
router.put('/cancel/:id',cancelAppointment)
router.delete('/:id', deleteAppointmentById);
router.put('/:id/complete', completeAppointment);
router.put('/update_datetime/:id', updateAppointmentDateTime);







module.exports = router;
