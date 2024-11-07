const mongoose = require('mongoose');
const Appointment = require('../models/appointement');
const Order = require('../models/order');
const Training = require('../models/training');

// Function to get completed appointment statistics by month
const getCompletedAppointmentStatistics = async (req, res) => {
  try {
    const completedAppointments = await Appointment.find({ status: 'Completed' });

    // Create an array to hold counts for each month
    const monthlyCounts = Array(12).fill(0); // January to December

    // Iterate through completed appointments and count by month
    completedAppointments.forEach(appointment => {
      const month = new Date(appointment.date).getMonth(); // 0-11
      monthlyCounts[month]++;
    });

    // Prepare response data
    const response = {
      labels: [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ],
      data: monthlyCounts
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching completed appointment statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to get completed sales statistics over time (by month)
const getCompletedSalesStatistics = async (req, res) => {
  try {
    const completedOrders = await Order.find({ status: 'Confirmed' });

    // Create an array to hold counts for each month
    const monthlySales = Array(12).fill(0); // January to December

    // Iterate through completed orders and count sales by month
    completedOrders.forEach(order => {
      const month = new Date(order.createdAt).getMonth(); // 0-11
      monthlySales[month]++;
    });

    // Prepare response data
    const response = {
      labels: [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ],
      data: monthlySales
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching completed sales statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to get training statistics
const getTrainingStatistics = async (req, res) => {
  try {
    const trainingStats = await Training.aggregate([
      {
        $project: {
          _id: 0, // Exclude the ID field from the result
          name: "$title",
          audience: "$audience",
          type: "$type",
          reservedPlaces: "$reservedPlaces",
          totalPrice: { $multiply: ["$reservedPlaces", "$price"] } // Calculate total price
        }
      },
      {
        $sort: { createdAt: -1 } // Sort by createdAt in descending order
      }
    ]);

    res.status(200).json(trainingStats);
  } catch (error) {
    console.error('Error retrieving training statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to get the number of pending orders
const getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    res.status(200).json(pendingOrders);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to get the number of active courses
const getActiveCourses = async (req, res) => {
    try {
      const activeCourses = await Training.countDocuments({
        $expr: { $lt: ["$reservedPlaces", "$places"] } // Compare reservedPlaces with places directly within the document
      });
      res.status(200).json(activeCourses);
    } catch (error) {
      console.error('Error fetching active courses:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  

// Function to get the total number of appointments
const getTotalAppointments = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    res.status(200).json(totalAppointments);
  } catch (error) {
    console.error('Error fetching total appointments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getCompletedAppointmentStatistics,
  getCompletedSalesStatistics,
  getTrainingStatistics,
  getPendingOrders,
  getActiveCourses,
  getTotalAppointments
};
