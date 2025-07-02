const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Cinema = require('../models/cinema');
const userModeling = require('../utils/userModeling');

const router = new express.Router();

// Create a cinema
router.post('/cinemas', auth.enhance, async (req, res) => {
  try {
    const cinema = new Cinema(req.body);
    await cinema.save();
    res.status(201).send(cinema);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Upload cinema image
router.post('/cinemas/photo/:id', upload('cinemas').single('file'), async (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const { file } = req;
  const cinemaIds = req.params.id;

  try {
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }

    const cinema = await Cinema.findById(cinemaIds);
    if (!cinema) return res.status(404).send({ error: 'Cinema not found' });

    cinema.image = `${url}/${file.path}`;
    await cinema.save();

    res.send({ cinema, file });
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: e.message });
  }
});

// Get all cinemas
router.get('/cinemas', async (req, res) => {
  try {
    const cinemas = await Cinema.find({});
    res.send(cinemas);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get cinema by ID
router.get('/cinemas/:id', async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) return res.status(404).send({ error: 'Cinema not found' });
    res.send(cinema);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Update cinema
router.patch('/cinemas/:id', auth.enhance, async (req, res) => {
  const allowedUpdates = ['name', 'ticketPrice', 'city', 'seats', 'seatsAvailable'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) return res.status(404).send({ error: 'Cinema not found' });

    updates.forEach(update => (cinema[update] = req.body[update]));
    await cinema.save();

    res.send(cinema);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Delete cinema
router.delete('/cinemas/:id', auth.enhance, async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndDelete(req.params.id);
    if (!cinema) return res.status(404).send({ error: 'Cinema not found' });

    res.send(cinema);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Get cinemas modeled for user
router.get('/cinemas/usermodeling/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const cinemas = await Cinema.find({});
    const cinemasUserModeled = await userModeling.cinemaUserModeling(cinemas, username);
    res.send(cinemasUserModeled);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
