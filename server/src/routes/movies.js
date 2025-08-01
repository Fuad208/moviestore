const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Movie = require('../models/movie');
const userModeling = require('../utils/userModeling');

const router = new express.Router();

// Create a movie
const Cinema = require('../models/cinema'); // Tambahkan jika belum ada

// Create a movie
router.post('/movies', auth.enhance, async (req, res) => {
  try {
    // Ambil semua cinema dari database
    const allCinemas = await Cinema.find({}, '_id');
    const cinemaIds = allCinemas.map(c => c._id);

    // Gabungkan data movie dengan semua cinemaIds
    const movie = new Movie({ ...req.body, cinemaIds });

    await movie.save();
    return res.status(201).send(movie); // ✅ hanya satu kali res.send
  } catch (e) {
    return res.status(400).send(e);
  }
});




router.post(
  '/movies/photo/:id',
  auth.enhance,
  upload('movies').single('file'),
  async (req, res, next) => {
    console.log('in here');
    const url = `${req.protocol}://${req.get('host')}`;
    const { file } = req;
    const movieId = req.params.id;
    console.log('check movie id', movieId);
    try {
      if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
      }
      const movie = await Movie.findById(movieId);

      console.log('check new', movie);

      if (!movie) return res.sendStatus(404);
      movie.image = `${url}/${file.path}`;
      await movie.save();
      res.send({ movie, file });
    } catch (e) {
      console.log(e);
      res.sendStatus(400).send(e);
    }
  }
);

// Get all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get movie by id
router.get('/movies/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const movie = await Movie.findById(_id);
    if (!movie) return res.sendStatus(404);
    return res.send(movie);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Update movie by id
router.put('/movies/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'title',
    'image',
    'language',
    'genre',
    'director',
    'cast',
    'description',
    'duration',
    'releaseDate',
    'endDate',
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const movie = await Movie.findById(_id);
    updates.forEach((update) => (movie[update] = req.body[update]));
    await movie.save();
    return !movie ? res.sendStatus(404) : res.send(movie);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// Delete movie by id
router.delete('/movies/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const movie = await Movie.findByIdAndDelete(_id);
    return !movie ? res.sendStatus(404) : res.send(movie);
  } catch (e) {
    return res.sendStatus(400);
  }
});

// Movies User modeling (Get Movies Suggestions)
router.get('/movies/usermodeling/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const cinemasUserModeled = await userModeling.moviesUserModeling(username);
    res.send(cinemasUserModeled);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
