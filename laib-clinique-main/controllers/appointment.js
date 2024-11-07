const Appointment = require("../models/appointement");
const mongoose = require('mongoose');
const Notification = require("../models/notification");
const sendEmail = require("../utils/sendMail");

const createAppointment = async (req, res) => {
  try {
      const { fullName, phoneNumber, location, date, category } = req.body;

      // Create a new appointment
      const newAppointment = new Appointment({
          fullName,
          phoneNumber,
          location,
          date,
          category,
      });

      // Save the appointment to the database
      const savedAppointment = await newAppointment.save();

      // Create a new notification
      const notification = new Notification({
          type: 'Appointment',
          username: fullName,
          id: savedAppointment._id.toString(),
      });

      // Save the notification
      const Newnotification = await notification.save();

      // Emit the notification via socket.io
      req.io.emit("new-notification", Newnotification);

      // Prepare the email body
      const emailBody = `
      Nouveau rendez-vous du client ${fullName}.<br /><br />
  
      Vous pouvez le consulter en suivant ce lien : <a href="${process.env.Front_URL}/appointments/${savedAppointment._id}">${process.env.Front_URL}/appointments/${savedAppointment._id}</a>.<br /><br />
  
      Merci de bien vouloir traiter cette demande de rendez-vous dans les plus brefs délais.<br /><br />
  
      Cordialement,<br />
      L'équipe de Laib Clinic
  `;
        
      // Send email notification to the same address
      await sendEmail(process.env.Mail_sender, 'Nouveau Rendez-vous', emailBody); // Ensure recipient is correct

      // Respond with the created appointment
      res.status(201).json(savedAppointment);
  } catch (error) {
      res.status(400).json({ message: 'Error creating appointment: ' + error.message });
      console.log(error)
  }
};



const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // Format each appointment's date to "yyyy-MM-dd"
    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment.toObject(),
      date: appointment.date.toISOString().split('T')[0], // Format date
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error });
  }
};


// Confirm Appointment
const confirmAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time, status } = req.body; // Accept date, time, and status in the request body

  // Validate the ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid appointment ID format' });
  }

  try {
    // Retrieve the current appointment to retain its date and time if not provided
    const currentAppointment = await Appointment.findById(id);
    
    if (!currentAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Determine the new values based on provided input, defaulting to existing values if not provided
    const updatedDate = date || currentAppointment.date;
    const updatedTime = time || currentAppointment.time;
    const updatedStatus = status || 'Confirmed';

    // Update the appointment with new date, time, and status
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { date: updatedDate, time: updatedTime, status: updatedStatus },
      { new: true } // Return the updated document
    );

    // Respond with success message and updated appointment data
    res.status(200).json({
      message: 'Appointment confirmed successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error confirming appointment', error });
  }
};




// Cancel Appointment
const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid appointment ID format' });
  }

  try {
    // Update the status to 'Cancelled'
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'Cancelled' }, // Capitalized 'Cancelled' to match the enum
      { new: true } // Return the updated document
    );

    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Return success response with the updated appointment
    res.status(200).json({ message: 'Appointment canceled successfully', appointment });
  } catch (error) {
    // Handle errors and return a server error response
    res.status(500).json({ message: 'Error canceling appointment', error });
  }
};


const getRecentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ date: -1 })
      .limit(6)
      .select('fullName date category');

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    const formattedAppointments = appointments.map(app => {
      if (!app.date) {
        return {
          fullName: app.fullName,
          date: 'Unknown',
          time: 'Unknown',
          category: app.category,
        };
      }
      return {
        fullName: app.fullName,
        date: app.date.toISOString().split('T')[0],
        time: app.date.toISOString().split('T')[1].slice(0, 5),
        category: app.category,
      };
    });

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    res.status(500).json({ message: 'Error retrieving appointments', error });
  }
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid appointment ID format' });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Format the date to "yyyy-MM-dd"
    const formattedAppointment = {
      ...appointment.toObject(),
      date: appointment.date.toISOString().split('T')[0], // Format date
    };

    res.status(200).json(formattedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteAppointment = async (req, res) => {
  const { fullName, phoneNumber } = req.body;

  if (!fullName || !phoneNumber) {
    return res.status(400).json({ message: 'FullName and PhoneNumber are required' });
  }

  try {
    const result = await Appointment.deleteOne({ fullName, phoneNumber });
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};

const deleteAppointmentById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'id is required' });
  }

  try {
    const result = await Appointment.deleteOne({_id:id});
    if (result.deletedCount === 0) {
      console.log("Appointment not found in database."); // Log when the order is not found
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};

const deleteAllAppointments = async (req, res) => {
  try {
    await Appointment.deleteMany({});
    res.status(200).json({ message: 'All appointments have been deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointments', error });
  }
};

const completeAppointment = async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid appointment ID format' });
  }

  try {
    // Find the appointment by ID
    const appointment = await Appointment.findById(id);

    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Ensure the appointment status is "Confirmed" before updating to "Completed"
    if (appointment.status !== 'Confirmed') {
      return res.status(400).json({ message: 'Appointment must be confirmed before it can be marked as completed' });
    }

    // Update the status to "Completed"
    appointment.status = 'Completed';
    const updatedAppointment = await appointment.save();

    // Return success response with the updated appointment
    res.status(200).json({ message: 'Appointment marked as completed successfully', appointment: updatedAppointment });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Error updating appointment status to completed', error });
  }
};


const updateAppointmentDateTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { date, time },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment updated successfully', updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

const addAppointmentAdmin = async (req, res) => {
  try {
    const { fullName, phoneNumber, location, date, time, category } = req.body;

    // Create new appointment with status confirmed
    const newAppointment = new Appointment({
      fullName,
      phoneNumber,
      location,
      date,
      time,
      category,
      status: 'Confirmed', // Set the status to confirmed
    });

    // Save to the database
    await newAppointment.save();

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: newAppointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
};


module.exports = {
  createAppointment,
  getAllAppointments,
  confirmAppointment,
  cancelAppointment,
  getRecentAppointments,
  getAppointmentById,
  deleteAppointment,
  deleteAllAppointments,
  deleteAppointmentById,
  completeAppointment,
  updateAppointmentDateTime,
  addAppointmentAdmin
  
};
