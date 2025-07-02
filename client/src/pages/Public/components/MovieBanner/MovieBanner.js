import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  makeStyles,
  withStyles
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { textTruncate } from '../../../../utils';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 360,
    margin: theme.spacing(2),
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: theme.shadows[4],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e2f',
    color: '#fff'
  },
  media: {
    height: 200,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  tag: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 12,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  movieTitle: {
    fontWeight: 600,
    fontSize: 20,
    lineHeight: 1.3,
    marginBottom: theme.spacing(1),
  },
  descriptionText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: theme.spacing(1),
  },
  director: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  duration: {
    fontSize: 13,
    marginBottom: 2,
  },
  genre: {
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    marginLeft: 'auto',
  },
  buttonIcon: {
    marginLeft: 4
  }
}));

const StyledRating = withStyles({
  iconFilled: {
    color: '#ffb400',
  },
  iconEmpty: {
    color: '#888',
  },
})(Rating);

const MovieCardBanner = ({ movie, fullDescription = false }) => {
  const classes = useStyles();
  if (!movie) return null;

  const images = {
    eternals: 'https://phantom-marca.unidadeditorial.es/927e619e34b67b9e7326c9266914e6f0/crop/68x0/1311x700/resize/1320/f/jpg/assets/multimedia/imagenes/2021/08/20/16294695683527.jpg',
    'spider man-no way home': 'https://images.indianexpress.com/2021/11/spider-man-no-way-home-new-poster-1200.jpg',
    'avengers-infinity war': 'https://pyxis.nymag.com/v1/imgs/8b3/ac6/ca28ec3072fdc00a5b59a72a75a39ab61b-20-avengers-lede.rsquare.w700.jpg',
    'doctor strange-multiverse of madness': 'https://m.media-amazon.com/images/I/818x-d2qUuL.jpg',
    'wakanda forever': 'https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat(jpg)/https%3A%2F%2Fblogs-images.forbes.com%2Fscottmendelson%2Ffiles%2F2017%2F10%2FDMQuyI5V4AAUHP0.jpg'
  };

  const imageUrl = movie.image || images[movie.title?.toLowerCase()] || 'https://source.unsplash.com/featured/?cinema';

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={imageUrl}
        title={movie.title}
      />
      <CardContent>
        {fullDescription && (
          <Box display="flex" flexWrap="wrap" mb={1}>
            {movie.genre.split(',').map((genre, index) => (
              <Typography key={index} className={classes.tag}>
                {genre}
              </Typography>
            ))}
            <StyledRating
              value={4}
              readOnly
              size="small"
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </Box>
        )}
        <Typography className={classes.movieTitle}>
          {movie.title}
        </Typography>
        <Typography className={classes.descriptionText}>
          {textTruncate(movie.description, 100)}
        </Typography>
        <Typography className={classes.director}>
          By: {movie.director}
        </Typography>
        <Typography className={classes.duration}>
          {movie.duration} min
        </Typography>
        <Typography className={classes.genre}>
          {movie.genre}
        </Typography>
      </CardContent>
<CardActions>
  <Link to={`booking/${movie._id}`} style={{ textDecoration: 'none' }}>
    <Button variant="contained" color="primary" className={classes.button}>
      Buy Tickets
      <ArrowRightAlt className={classes.buttonIcon} />
    </Button>
  </Link>
</CardActions>


    </Card>
  );
};

export default MovieCardBanner;
