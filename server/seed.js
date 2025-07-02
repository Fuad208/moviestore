// seed.js
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./src/models/user');
const Movie = require('./src/models/movie');
const Cinema = require('./src/models/cinema');
const Showtime = require('./src/models/showtime');
const Reservation = require('./src/models/reservation');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Clear collections
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Cinema.deleteMany({}),
      Showtime.deleteMany({}),
      Reservation.deleteMany({}),
    ]);

    const createUser = async data => {
      const user = new User(data);
      await user.save();
      return user;
    };

    const [superadmin, admin1, staff1, user1] = await Promise.all([
      createUser({
        name: 'Fuad Al Fajri',
        username: 'fuad',
        email: 'fuad@example.com',
        password: 'secure1234',
        role: 'superadmin',
        phone: '+6281234567890',
      }),
      createUser({
        name: 'Admin Satu',
        username: 'admin1',
        email: 'admin1@example.com',
        password: 'adminpass',
        role: 'admin',
        phone: '+6281111111111',
      }),
      createUser({
        name: 'Staff Satu',
        username: 'staff1',
        email: 'staff1@example.com',
        password: 'staffpass',
        role: 'staff',
        phone: '+6282222222222',
      }),
      createUser({
        name: 'User Satu',
        username: 'user1',
        email: 'user1@example.com',
        password: 'userpass',
        role: 'user',
        phone: '+6283333333333',
      }),
    ]);

    const movie1 = await new Movie({
      title: 'Interstellar',
      image: 'https://image.tmdb.org/t/p/original/8N0DNa4BO3l3p9y7CDV7lBUCTG9.jpg',
      language: 'english',
      genre: 'sci-fi',
      director: 'Christopher Nolan',
      cast: 'Matthew McConaughey, Anne Hathaway',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      duration: 169,
      releaseDate: new Date('2024-01-01'),
      endDate: new Date('2024-02-01')
    }).save();

    const movie2 = await new Movie({
      title: 'Inception',
      image: 'https://image.tmdb.org/t/p/original/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
      language: 'english',
      genre: 'sci-fi, action',
      director: 'Christopher Nolan',
      cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
      description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      duration: 148,
      releaseDate: new Date('2024-03-01'),
      endDate: new Date('2024-04-01')
    }).save();

    const cinema1 = await new Cinema({
      name: 'Fuad XXI',
      ticketPrice: 50000,
      city: 'Jakarta',
      seats: Array.from({ length: 100 }, (_, i) => `A${i + 1}`),
      seatsAvailable: 100,
      image: 'https://example.com/cinema.jpg'
    }).save();

    const cinema2 = await new Cinema({
      name: 'Cinema Rakyat',
      ticketPrice: 35000,
      city: 'Bandung',
      seats: Array.from({ length: 80 }, (_, i) => `B${i + 1}`),
      seatsAvailable: 80,
      image: 'https://example.com/cinema2.jpg'
    }).save();

    await Promise.all(
      ['13:00', '16:00', '19:00'].map(time =>
        Showtime.create({
          movieId: movie1._id,
          cinemaId: cinema1._id,
          startDate: new Date('2025-07-01'),
          endDate: new Date('2025-07-07'),
          startAt: time
        })
      )
    );

    await Promise.all(
      ['14:00', '17:00', '20:00'].map(time =>
        Showtime.create({
          movieId: movie2._id,
          cinemaId: cinema2._id,
          startDate: new Date('2025-07-05'),
          endDate: new Date('2025-07-15'),
          startAt: time
        })
      )
    );

    await Reservation.create({
      date: new Date('2025-07-02'),
      startAt: '13:00',
      seats: ['A1', 'A2'],
      ticketPrice: 50000,
      total: 100000,
      movieId: movie1._id,
      cinemaId: cinema1._id,
      username: user1.username,
      phone: user1.phone,
      checkin: false
    });

    console.log('✅ Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seed();