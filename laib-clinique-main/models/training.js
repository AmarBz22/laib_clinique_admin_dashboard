const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  price :{
    type : Number,
    required : true
  },
  date: {
    type: Date,
    required: true
  },
  places: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['paid', 'free', 'reduced'], // Enum for the three types of training
    required: true
  },
  audience: {
    type: String,
    enum: ['family and children', 'specialist'], // Enum for the two audience types
    required: true
  },
  reservedPlaces: {
    type: Number,
    default: 0,
    min: 0
  },
  
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
