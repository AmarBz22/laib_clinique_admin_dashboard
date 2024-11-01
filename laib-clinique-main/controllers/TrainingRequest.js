const TR = require('../models/TrainingRequest');
const Notification = require('../models/notification');
const Training = require('../models/training'); // Import the Training model
const sendEmail = require('../utils/sendMail');

// Create a new training request
const CreateTR = async (req, res) => {
  try {
      const { name, phone, email, title } = req.body;

      // Check if a training request with the same email and title already exists
      const existingRequest = await TR.findOne({ email, title });
      if (existingRequest) {
          console.error(`You have already sent a training request for the course "${title}"`);
          return res.status(400).json({ message: `You have already sent a training request for the course "${title}"` });
      }

      // Set the training field to the value of title
      const trainingRequest = await TR.create({ name, phone, email, title, training: title });
      const training = await Training.findOne({ title });
      if (!training) {
          return res.status(400).json({ message: 'No course with this title' });
      }

      // Create a notification
      const notification = {
          type: 'Training Request', // Specify the type of notification
          username: name,           // Assuming the username is the name of the person making the request
          id: training._id,        // Use the ID of the training course
      };

      // Save the notification
      const Newnotification = await Notification.create(notification);
      req.io.emit("new-notification", Newnotification);

      // Prepare the email body and subject
      const emailBody = `New Training Request from the client ${name}.\nYou can check it at the URL: ${process.env.Front_URL}/courses/${training._id}`;
      const emailSubject = `New Training Request for ${title}`; // Dynamic subject line

      // Send email notification to the specified recipient
      await sendEmail(process.env.Mail_sender, emailSubject, emailBody); // Ensure the recipient is correct

      // Respond with the created training request
      res.status(201).json(trainingRequest);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating training request', error });
  }
};





// Get all training requests
const getAlltr = async (req, res) => {
    try {
        const trainingRequests = await TR.find().populate('training'); // Populate the training details
        res.status(200).json(trainingRequests);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving training requests', error });
    }
};

// Delete a training request by ID
const deleteTR = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const result = await TR.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Training request not found' });
        }

        res.status(200).json({ message: 'Training request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting training request', error });
    }
};

// Get training requests by course title
const getTrainingByCourse = async (req, res) => {
    try {
        const { title } = req.params;

        if (!title) {
            return res.status(400).json({ message: 'The title of the course is required' });
        }

        const requests = await TR.find({ title }).populate('training');
        res.status(200).json({ result: requests });
    } catch (error) {
        res.status(500).json({ message: 'Error getting training requests', error });
    }
};



const confirmTR = async (req, res) => {
  try {
      const { requestId } = req.params;

      if (!requestId) {
          return res.status(400).json({ message: 'Request ID is required' });
      }

      // Find the training request by ID
      const trainingRequest = await TR.findById(requestId);
      if (!trainingRequest) {
          return res.status(404).json({ message: 'Training request not found' });
      }

      // Ensure the request is not already confirmed (status: 'completed')
      if (trainingRequest.status === 'completed') {
          return res.status(400).json({ message: 'This request is already confirmed' });
      }

      // Find the corresponding training by title
      const training = await Training.findOneAndUpdate(
          { title: trainingRequest.title },
          { $inc: { reservedPlaces: 1 } },
          { new: true }
      );

      if (!training) {
          return res.status(404).json({ message: 'Training not found' });
      }

      if (training.places <= training.reservedPlaces) {
          return res.status(400).json({ message: 'No available places for this training' });
      }

      // Update the training request to mark it as confirmed
      trainingRequest.confirmed = true;
      trainingRequest.training = trainingRequest.title; // Assign training title to 'training' field
      trainingRequest.status = 'completed'; // Update status to 'completed'
      await trainingRequest.save();

      // Prepare email content
      const emailBody = `Dear ${trainingRequest.name},\n\n

      We are pleased to inform you that your training request for "${trainingRequest.title}" has been successfully confirmed!\n\n
      
      Please mark your calendar for the training date and ensure to arrive at least 15 minutes early to make the most of the experience. If you have any questions or need further assistance, feel free to reach out to our team.\n\n
      
      Best regards,\n
      Laib Clinic Team`;
      
      const recipientEmail = trainingRequest.email; // Ensure this is set correctly

      // Check if recipient email is defined
      if (!recipientEmail) {
          return res.status(400).json({ message: 'Recipient email is not defined' });
      }

      // Send email notification to the requestor
      await sendEmail(recipientEmail, 'Training Request Confirmation', emailBody); // Correctly passing recipient

      res.status(200).json({
          message: 'Training request confirmed successfully',
          trainingRequest,
          training,
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error confirming training request', error });
  }
};


const cancelRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
      if (!requestId) {
          return res.status(400).json({ message: 'Request ID is required' });
      }

      // Find the training request by ID
      const request = await TR.findById(requestId);
      if (!request) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // Ensure the request is completed before canceling
      if (request.status !== 'completed') {
          return res.status(400).json({ message: 'Only completed requests can be canceled' });
      }

      // Find the corresponding training by title
      const training = await Training.findOne({ title: request.title });
      if (!training) {
          return res.status(404).json({ message: 'Training not found' });
      }

      // Decrease the reserved places
      training.reservedPlaces -= 1;
      await training.save();

      // Delete the training request
      await TR.findByIdAndDelete(requestId);

      const recipientEmail = request.email; // Ensure this is set correctly
      console.log('Recipient Email:', recipientEmail); // Debugging line

    

      // Prepare email content
      const emailBody = `
          Dear ${request.name},\n
          \n
          Your training request for "${request.title}" has been successfully canceled.\n
          \n
          If you have any questions or would like to reschedule, please feel free to reach out.\n
          \n
          Best regards,\n
          Laib Clinic Team
      `;


      // Send email notification to the requestor
      await sendEmail(recipientEmail, 'Training Request Cancellation', emailBody); // Correctly passing recipient

      res.status(200).json({ message: 'Request cancelled and removed successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error cancelling request', error: error.message });
  }
};



  
  
module.exports = { CreateTR, getAlltr, deleteTR, getTrainingByCourse, confirmTR ,cancelRequest };
