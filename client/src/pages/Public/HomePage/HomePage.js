// HomePage.js
import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withStyles,
  Box,
  Grid,
  Typography,
  Paper,
  Button
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
  getMovies,
  getShowtimes,
  getMovieSuggestion
} from '../../../store/actions';
import { AttachMoney, EventSeat } from '@material-ui/icons';
import styles from './styles';

class HomePage extends Component {
  componentDidMount() {
    const {
      movies,
      showtimes,
      suggested,
      getMovies,
      getShowtimes,
      getMovieSuggestion,
      user
    } = this.props;

    if (!movies.length) getMovies();
    if (!showtimes.length) getShowtimes();
    if (user && !suggested.length) getMovieSuggestion(user.username);
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user && this.props.user) {
      this.props.getMovieSuggestion(this.props.user.username);
    }
  }

  render() {
    const { classes, movies } = this.props;

    return (
      <Fragment>
        <Box className={classes.root}>
          <Typography
            variant="h5"
            style={{ margin: '20px 0', color: 'white' }}
          >
            All Movies
          </Typography>

          <Grid container spacing={3}>
            {movies.length > 0 ? (
              movies.map(movie => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                  <Paper
                    elevation={3}
                    style={{
                      background: '#1e1e2f',
                      borderRadius: 12,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}
                  >
                    <div
                      style={{
                        height: '200px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={
                          movie.image ||
                          'https://via.placeholder.com/300x180.png?text=Movie+Image'
                        }
                        alt={movie.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <Box p={2} style={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{ color: 'white' }}
                      >
                        {movie.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: '#ccc', marginBottom: 12 }}
                      >
                        {movie.description?.slice(0, 80)}...
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AttachMoney style={{ color: '#ccc' }} />
                        <Typography
                          style={{ color: '#ccc', marginLeft: 8 }}
                          variant="body2"
                        >
                          50000 IDR
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <EventSeat style={{ color: '#ccc' }} />
                        <Typography
                          style={{ color: '#ccc', marginLeft: 8 }}
                          variant="body2"
                        >
                          100 seats available
                        </Typography>
                      </Box>
                      <Box mt="auto">
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          component={Link}
                          to={`/booking/${movie._id}`}
                        >
                          Buy Tickets
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" style={{ color: 'white' }}>
                No movies available.
              </Typography>
            )}
          </Grid>
        </Box>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  movies: PropTypes.array.isRequired,
  latestMovies: PropTypes.array.isRequired
};

const mapStateToProps = ({ movieState, showtimeState, authState }) => ({
  movies: movieState.movies,
  showtimes: showtimeState.showtimes,
  suggested: movieState.suggested,
  user: authState.user
});

const mapDispatchToProps = {
  getMovies,
  getShowtimes,
  getMovieSuggestion
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(HomePage));
