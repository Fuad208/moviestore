const mongoose = require('mongoose');

const { Schema } = mongoose;
const showtimeSchema = new Schema({
  startAt: {
    type: String,
    required: true,
    trim: true,
  },
  startAt: {
  type: [String],
  required: true,
},

  endDate: {
    type: Date,
    required: true,
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  cinemaIds: {
    type: Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true,
  },
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
