import {
  GET_MOVIES,
  SELECT_MOVIE,
  GET_SUGGESTIONS
} from '../types';

const initialState = {
  movies: [],
  randomMovie: null,
  latestMovies: [],
  nowShowing: [],
  comingSoon: [],
  selectedMovie: null,
  suggested: []
};

// Fungsi untuk mengelola data film yang didapat dari backend
const getMovies = (state, payload) => {
  if (!Array.isArray(payload)) return state;

  const now = new Date();

  const latestMovies = [...payload]
    .sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate))
    .slice(0, 5);

  const nowShowing = payload.filter(
    movie =>
      new Date(movie.endDate) >= now &&
      new Date(movie.releaseDate) <= now
  );

  const comingSoon = payload.filter(movie =>
    new Date(movie.releaseDate) > now
  );

  const randomMovie = payload.length > 0
    ? payload[Math.floor(Math.random() * payload.length)]
    : null;

  return {
    ...state,
    movies: payload,
    randomMovie,
    latestMovies,
    nowShowing,
    comingSoon // ✅ sudah benar, tidak ditimpa
  };
};

// Fungsi untuk menyimpan film yang dipilih pengguna
const onSelectMovie = (state, payload) => ({
  ...state,
  selectedMovie: payload
});

// Fungsi untuk menyimpan hasil rekomendasi film
const getMovieSuggestions = (state, payload) => ({
  ...state,
  suggested: payload
});

// Reducer utama
export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MOVIES:
      return getMovies(state, payload);
    case SELECT_MOVIE:
      return onSelectMovie(state, payload);
    case GET_SUGGESTIONS:
      return getMovieSuggestions(state, payload);
    default:
      return state;
  }
};
