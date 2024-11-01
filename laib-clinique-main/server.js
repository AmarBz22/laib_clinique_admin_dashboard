const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orderRoute');
const productRoutes = require('./routes/productRoute');
const appointmentRoutes = require('./routes/appointementRoute'); // Fixed typo in route import
const trainingRoutes = require('./routes/trainingRoute');
const trainingRequestRoutes = require('./routes/trainingrequest'); // Improved naming convention
const notificationRoutes = require('./routes/notificationRoute')
const connectedDB = require('./config/database');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const statisticsRoutes = require('./routes/statisticsRoute');


require('dotenv').config();  // Load .env file

const app = express();
const PORT = process.env.PORT || 4000;


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


// Connect to the database
connectedDB();

// Middleware
// Define your allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174'  // Add more ports or origins as needed
       // Example of a different origin
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/trainingrequest', trainingRequestRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/statistics', statisticsRoutes);



// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ message: 'Internal Server Error' }); // Send a generic error response
});



io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
