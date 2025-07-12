import React from 'react';
import PropTypes from 'prop-types';

const HomePage = ({ latestMovies }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎬 Latest Movies</h1>
      {latestMovies.length === 0 ? (
        <p>No movies available.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {latestMovies.map((movie) => (
            <div key={movie._id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: '1rem' }}>
              <img
                src={movie.image || '/fallback.jpg'}
                alt={movie.title}
                style={{ width: '100%', height: 'auto', borderRadius: 4 }}
              />
              <h3>{movie.title}</h3>
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Duration:</strong> {movie.duration} mins</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

HomePage.propTypes = {
  latestMovies: PropTypes.array.isRequired,
};

HomePage.defaultProps = {
  latestMovies: [],
};

export default HomePage;
