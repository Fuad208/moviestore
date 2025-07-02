const mongoose = require('mongoose');

const { Schema } = mongoose;

const seatSchema = new Schema({
  row: String,
  number: Number,
  available: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const cinemaSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  seats: {
    type: [seatSchema],
    required: true,
    default: []
  },
  seatsAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  }
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
