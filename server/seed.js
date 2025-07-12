import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force load .env duluan sebelum import mongoose.js
const envPath = path.resolve(__dirname, './.env');
dotenv.config({ path: envPath });

console.log('🧪 ENV dari seed.js:', process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  console.error('❌ GAGAL load MONGODB_URI di seed.js!');
  process.exit(1);
}

// Baru sekarang import koneksi mongoose-nya
import './src/db/mongoose.js';
import mongoose from 'mongoose';

import User from './src/models/user.js';
import Movie from './src/models/movie.js';
import Cinema from './src/models/cinema.js';
import Showtime from './src/models/showtime.js';
import Reservation from './src/models/reservation.js';

async function seed() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Cinema.deleteMany({}),
      Showtime.deleteMany({}),
      Reservation.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing data');

    // Create users
    const users = await Promise.all([
      User.create({
        name: 'Super Admin',
        username: 'superadmin',
        email: 'superadmin@moviestore.com',
        password: 'superadmin123',
        role: 'superadmin',
        phone: '+6281234567890',
      }),
      User.create({
        name: 'Admin User',
        username: 'admin',
        email: 'admin@moviestore.com',
        password: 'admin123',
        role: 'admin',
        phone: '+6281111111111',
      }),
      User.create({
        name: 'Staff User',
        username: 'staff',
        email: 'staff@moviestore.com',
        password: 'staff123',
        role: 'staff',
        phone: '+6282222222222',
      }),
      User.create({
        name: 'Regular User',
        username: 'user',
        email: 'user@moviestore.com',
        password: 'user123',
        role: 'user',
        phone: '+6283333333333',
      }),
    ]);
    console.log('👥 Created users');

    // Create cinemas
    const cinemas = await Promise.all([
      Cinema.create({
        name: 'CGV Grand Indonesia',
        ticketPrice: 75000,
        city: 'jakarta',
        seats: Array.from({ length: 100 }, (_, i) => ({
          row: String.fromCharCode(65 + Math.floor(i / 10)),
          number: (i % 10) + 1,
          available: true
        })),
        seatsAvailable: 100,
        image: 'https://jadwalnonton.com/data/images/theaters/cgv-grand-indonesia-jakarta_430x280.jpg'
      }),
      Cinema.create({
        name: 'Cinema XXI Bandung',
        ticketPrice: 50000,
        city: 'bandung',
        seats: Array.from({ length: 80 }, (_, i) => ({
          row: String.fromCharCode(65 + Math.floor(i / 10)),
          number: (i % 10) + 1,
          available: true
        })),
        seatsAvailable: 80,
        image: 'https://tse3.mm.bing.net/th/id/OIP.aJs8h0Df1zf-tabqgnZa-gAAAA?pid=Api&P=0&h=220'
      }),
      Cinema.create({
        name: 'Cinepolis Surabaya',
        ticketPrice: 60000,
        city: 'surabaya',
        seats: Array.from({ length: 120 }, (_, i) => ({
          row: String.fromCharCode(65 + Math.floor(i / 12)),
          number: (i % 12) + 1,
          available: true
        })),
        seatsAvailable: 120,
        image: 'https://cdn.teater.co/img_theater/webp/cinepolis_480.webp'
      }),
      Cinema.create({
        name: 'Platinum Cineplex',
        ticketPrice: 60000,
        city: 'surakarta',
        seats: Array.from({ length: 120 }, (_, i) => ({
          row: String.fromCharCode(65 + Math.floor(i / 12)),
          number: (i % 12) + 1,
          available: true
        })),
        seatsAvailable: 120,
        image: 'https://showpoiler.com/wp-content/uploads/2022/11/bioskop-di-Indonesia-5_.webp'
      }),
      Cinema.create({
        name: 'New Star Cineplex',
        ticketPrice: 30000,
        city: 'bekasi',
        seats: Array.from({ length: 120 }, (_, i) => ({
          row: String.fromCharCode(65 + Math.floor(i / 12)),
          number: (i % 12) + 1,
          available: true
        })),
        seatsAvailable: 120,
        image: 'https://ratekom.com/wp-content/uploads/2020/11/Star-Cineplex.png'
      }),
    ]);
    console.log('🏢 Created cinemas');

    // Create movies
    const movies = await Promise.all([
      Movie.create({
        title: 'avatar: the way of water',
        image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        language: 'english',
        genre: 'action, adventure, fantasy',
        director: 'james cameron',
        cast: 'sam worthington, zoe saldana, sigourney weaver',
        description: 'jake sully lives with his newfound family formed on the planet of pandora.',
        duration: 192,
        releaseDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'top gun: maverick',
        image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        language: 'english',
        genre: 'action, drama',
        director: 'joseph kosinski',
        cast: 'tom cruise, miles teller, jennifer connelly',
        description: 'after thirty years, maverick is still pushing the envelope as a top naval aviator.',
        duration: 130,
        releaseDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'black panther: wakanda forever',
        image: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
        language: 'english',
        genre: 'action, adventure, drama',
        director: 'ryan coogler',
        cast: 'letitia wright, lupita nyongo, danai gurira',
        description: 'the people of wakanda fight to protect their home from intervening world powers.',
        duration: 161,
        releaseDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Oppenheimer',
        image: 'https://upload.wikimedia.org/wikipedia/id/4/4a/Oppenheimer_%28film%29.jpg',
        language: 'english',
        genre: 'drama, history, thriller',
        director: 'christopher nolan',
        cast: 'cillian murphy, emily blunt, matt damon',
        description: 'the story of j. robert oppenheimer and the creation of the atomic bomb.',
        duration: 180,
        releaseDate: new Date('2025-02-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Dune: Part Two',
        image: 'https://upload.wikimedia.org/wikipedia/id/4/4d/Poster_film_dune_part_two.jpg',
        language: 'english',
        genre: 'sci-fi, adventure, action',
        director: 'denis villeneuve',
        cast: 'timothée chalamet, zendaya, josh brolin',
        description: 'paul atreides unites with the fremen to take revenge against the conspirators.',
        duration: 166,
        releaseDate: new Date('2025-03-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Wiro Sableng',
        image: 'https://upload.wikimedia.org/wikipedia/id/5/52/Poster_film_Wiro_Sableng_212.jpg',
        language: 'indonesian',
        genre: 'action, comedy, fantasy',
        director: 'angga dwimas sasongko',
        cast: 'vino g. bastian, sherina munaf, yayan ruhian',
        description: 'seorang pendekar eksentrik menjalankan misi rahasia melawan pengkhianat.',
        duration: 120,
        releaseDate: new Date('2025-01-15'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Dilan 1990',
        image: 'https://upload.wikimedia.org/wikipedia/id/1/19/Dilan_1990_%28poster%29.jpg',
        language: 'indonesian',
        genre: 'romance, drama',
        director: 'fajar bustomi',
        cast: 'iqbaal dhiafakhri, vanesha prescilla',
        description: 'kisah cinta remaja antara milea dan dilan di bandung tahun 90an.',
        duration: 110,
        releaseDate: new Date('2025-02-10'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Pengabdi Setan',
        image: 'https://upload.wikimedia.org/wikipedia/id/e/e1/Pengabdi_Setan_poster.jpg',
        language: 'indonesian',
        genre: 'horror, mystery',
        director: 'joko anwar',
        cast: 'tara basro, endy arfian, bront palarae',
        description: 'keluarga dihantui oleh arwah ibu mereka setelah meninggal secara misterius.',
        duration: 107,
        releaseDate: new Date('2025-03-20'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Gundala',
        image: 'https://m.media-amazon.com/images/S/pv-target-images/72dcf55d0f9024c88af74058d990625f2b97168de2e20521c9a0dcc3a12e0829.jpg',
        language: 'indonesian',
        genre: 'action, sci-fi',
        director: 'joko anwar',
        cast: 'abimana aryasatya, tara basro, bront palarae',
        description: 'seorang pria biasa mendapatkan kekuatan petir untuk melawan kejahatan.',
        duration: 119,
        releaseDate: new Date('2025-03-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Imperfect',
        image: 'https://cdn0-production-images-kly.akamaized.net/22nfx7w8cvDtbJo7zsi-NbRBe0k=/800x1066/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3001609/original/010657400_1576822022-Poster_Imperfect_Mila.png.jpg',
        language: 'indonesian',
        genre: 'comedy, drama, romance',
        director: 'ernest prakasa',
        cast: 'jessica mila, reza rahadian, yasmin napper',
        description: 'kisah riana, wanita insecure yang belajar mencintai dirinya sendiri.',
        duration: 113,
        releaseDate: new Date('2025-04-05'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Spider-Man: No Way Home',
        image: 'https://cdn1-production-images-kly.akamaized.net/Dlxa3oF5R6V6HaKf34B4xEqvT6A=/800x1066/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3635478/original/025116000_1637133546-253154135_2120128131476179_3401639978712735642_n.jpg',
        language: 'english',
        genre: 'action, adventure, sci-fi',
        director: 'jon watts',
        cast: 'tom holland, zendaya, benedict cumberbatch',
        description: 'peter parker seeks help from doctor strange after his identity is revealed.',
        duration: 148,
        releaseDate: new Date('2025-04-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'John Wick: Chapter 4',
        image: 'https://m.media-amazon.com/images/I/81fk-N7tvbL._UF894,1000_QL80_.jpg',
        language: 'english',
        genre: 'action, thriller, crime',
        director: 'chad stahelski',
        cast: 'keanu reeves, donnie yen, bill skarsgård',
        description: 'john wick takes his fight against the high table global.',
        duration: 169,
        releaseDate: new Date('2025-05-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'The Batman',
        image: 'https://images-cdn.ubuy.co.in/641491225f99eb32e66003b3-the-batman-movie-poster-rays-of.jpg',
        language: 'english',
        genre: 'crime, drama, mystery',
        director: 'matt reeves',
        cast: 'robert pattinson, zoë kravitz, paul dano',
        description: 'batman uncovers corruption in gotham and questions his family’s involvement.',
        duration: 176,
        releaseDate: new Date('2025-06-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Doctor Strange in the Multiverse of Madness',
        image: 'https://lumiere-a.akamaihd.net/v1/images/p_drstrangeinthemultiverseofmadness_245_476cabb1.jpeg?region=0%2C0%2C540%2C810',
        language: 'english',
        genre: 'fantasy, adventure, action',
        director: 'sam raimi',
        cast: 'benedict cumberbatch, elizabeth olsen, xochitl gomez',
        description: 'doctor strange explores the multiverse with the help of mystical allies.',
        duration: 126,
        releaseDate: new Date('2025-08-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'The Flash',
        image: 'https://upload.wikimedia.org/wikipedia/en/4/4a/The_Flash_season_7.jpg',
        language: 'english',
        genre: 'action, adventure, fantasy',
        director: 'andy muschietti',
        cast: 'ezra miller, michael keaton, sasha calle',
        description: 'barry allen travels through time to change past events.',
        duration: 144,
        releaseDate: new Date('2025-09-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Satan’s Slaves 2: Communion',
        image: 'https://pers-upn.com/wp-content/uploads/Pengabdi-Setan-2-697x1024.jpg',
        language: 'indonesian',
        genre: 'horror, thriller',
        director: 'joko anwar',
        cast: 'tara basro, endy arfian, bront palarae',
        description: 'kelanjutan kisah keluarga yang dihantui oleh kekuatan gaib yang mengerikan.',
        duration: 118,
        releaseDate: new Date('2025-09-10'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'KKN di Desa Penari',
        image: 'https://m.media-amazon.com/images/M/MV5BNTMxODczNmUtOTJjZC00MTk4LWI1ZTUtMWRjYTczNjRkMTdlXkEyXkFqcGc@._V1_.jpg',
        language: 'indonesian',
        genre: 'horror, mystery',
        director: 'awwin sujarwo',
        cast: 'tissa biani, achmad megantara, adinda thomas',
        description: 'kelompok mahasiswa kkn mengalami kejadian mistis di desa terpencil.',
        duration: 130,
        releaseDate: new Date('2025-08-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Habibie & Ainun',
        image: 'https://m.media-amazon.com/images/M/MV5BZTY0YjRjNzQtNDc1Yi00OTA3LTk4M2QtMjA5MDczMTUzOTg5XkEyXkFqcGc@._V1_.jpg',
        language: 'indonesian',
        genre: 'biography, drama, romance',
        director: 'faozan rizal',
        cast: 'reza rahadian, bunga citra lestari',
        description: 'kisah cinta presiden bj habibie dan ainun dari masa ke masa.',
        duration: 118,
        releaseDate: new Date('2025-07-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Mencuri Raden Saleh',
        image: 'https://cdn0-production-images-kly.akamaized.net/iKK6lnMnQVUQZYtnrjhDy02Au6c=/1200x1200/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/4130913/original/036990300_1661091904-Mencuri_Raden_Saleh_1.jpg',
        language: 'indonesian',
        genre: 'action, heist, drama',
        director: 'angga dwimas sasongko',
        cast: 'iqbaal ramadhan, angga yunanda, rachel amanda',
        description: 'sekelompok remaja berencana mencuri lukisan legendaris raden saleh.',
        duration: 154,
        releaseDate: new Date('2025-06-01'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
      Movie.create({
        title: 'Suzzanna: Bernapas Dalam Kubur',
        image: 'https://upload.wikimedia.org/wikipedia/id/5/56/Poster_suzanna.jpg',
        language: 'indonesian',
        genre: 'horror, thriller',
        director: 'rocky soraya, anghgy umbara',
        cast: 'luna maya, tiziana evans, teuku rifnu wikana',
        description: 'seorang wanita yang mati secara tragis kembali dari kubur untuk membalas dendam.',
        duration: 125,
        releaseDate: new Date('2025-05-15'),
        endDate: new Date('2025-12-31'),
        cinemaIds: cinemas.map(c => c._id)
      }),
    ]);
    console.log('🎬 Created movies');

    // Create showtimes
    const showtimes = [];
    const times = ['10:00', '13:00', '16:00', '19:00', '22:00'];
    
    for (const movie of movies) {
      for (const cinema of cinemas) {
        for (const time of times) {
          showtimes.push({
            movieId: movie._id,
            cinemaIds: cinema._id,
            startAt: time,
            startDate: new Date('2025-07-01'),
            endDate: new Date('2025-07-31'),
          });
        }
      }
    }
    
    await Showtime.insertMany(showtimes);
    console.log('⏰ Created showtimes');

    // Create sample reservations
    const reservations = await Promise.all([
      Reservation.create({
        date: new Date('2025-07-15'),
        startAt: '19:00',
        seats: ['A1', 'A2'],
        ticketPrice: 75000,
        total: 150000,
        movieId: movies[0]._id,
        cinemaIds: cinemas[0]._id,
        username: users[3].username,
        phone: users[3].phone,
        checkin: false
      }),
      Reservation.create({
        date: new Date('2025-07-16'),
        startAt: '16:00',
        seats: ['B5', 'B6', 'B7'],
        ticketPrice: 50000,
        total: 150000,
        movieId: movies[1]._id,
        cinemaIds: cinemas[1]._id,
        username: users[3].username,
        phone: users[3].phone,
        checkin: false
      }),
    ]);
    console.log('🎫 Created reservations');

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`Users: ${users.length}`);
    console.log(`Cinemas: ${cinemas.length}`);
    console.log(`Movies: ${movies.length}`);
    console.log(`Showtimes: ${showtimes.length}`);
    console.log(`Reservations: ${reservations.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();