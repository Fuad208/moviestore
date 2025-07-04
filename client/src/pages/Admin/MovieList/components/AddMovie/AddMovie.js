import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Typography, Select } from '@material-ui/core';
import { Button, TextField, MenuItem } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import styles from './styles';
import { genreData, languageData } from '../../../../../data/MovieDataService';
import {
  addMovie,
  updateMovie,
  removeMovie
} from '../../../../../store/actions';
import FileUpload from '../../../../../components/FileUpload/FileUpload';

class AddMovie extends Component {
  state = {
    title: '',
    image: null,
    genre: [],
    language: '',
    duration: '',
    description: '',
    director: '',
    cast: '',
    releaseDate: new Date(),
    endDate: new Date(),
    cinemaIds:[],
    cinemas: []
  };

  async componentDidMount() {
    if (this.props.edit) {
      const {
        title, language, genre, director, cast,
        description, duration, releaseDate, endDate, cinemaIds
      } = this.props.edit;
      this.setState({
        title,
        language,
        genre: genre.split(','),
        director,
        cast,
        description,
        duration,
        releaseDate,
        endDate,
        cinemaIds: cinemaIds || ''
      });
    }

    try {
  const res = await fetch('/cinemas'); // HAPUS '/api'
  const cinemas = await res.json();
  this.setState({
    cinemas,
    cinemaIds: cinemas.map(c => c._id)
  });
} catch (error) {
  console.error('Failed to fetch cinemas', error);
}

  }

  componentDidUpdate(prevProps) {
    if (prevProps.movie !== this.props.movie) {
      const { title, genre, language } = this.props.movie;
      this.setState({ title, genre, language });
    }
  }

  handleChange = e => {
    this.setState({
      state: e.target.value
    });
  };

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };
    newState[field] = value;
    this.setState(newState);
  };

  onAddMovie = () => {
    const { image, genre, cinemaIds, ...rest } = this.state;
    const movie = { ...rest, genre: genre.join(','), cinemaIds };
    this.props.addMovie(image, movie);
  };

  onUpdateMovie = () => {
    const { image, genre, cinemaIds, ...rest } = this.state;
    const movie = { ...rest, genre: genre.join(','), cinemaIds };
    this.props.updateMovie(this.props.edit._id, movie, image);
  };

  onRemoveMovie = () => this.props.removeMovie(this.props.edit._id);

  render() {
    const { classes, className } = this.props;
    const {
      title, image, genre, language, duration, description,
      director, cast, releaseDate, endDate, cinemaIds, cinemas
    } = this.state;

    const rootClassName = classNames(classes.root, className);
    const subtitle = this.props.edit ? 'Edit Movie' : 'Add Movie';
    const submitButton = this.props.edit ? 'Update Movie' : 'Save Details';
    const submitAction = this.props.edit
      ? () => this.onUpdateMovie()
      : () => this.onAddMovie();

    return (
      <div className={rootClassName}>
        <Typography variant="h4" className={classes.title}>
          {subtitle}
        </Typography>
        <form autoComplete="off" noValidate>
          <div className={classes.field}>
            <TextField
              className={classes.textField}
              helperText="Please specify the title"
              label="Title"
              margin="dense"
              required
              value={title}
              variant="outlined"
              onChange={event => this.handleFieldChange('title', event.target.value)}
            />
          </div>

          <div className={classes.field}>
            <Select
              multiple
              displayEmpty
              className={classes.textField}
              label="Genre"
              margin="dense"
              required
              value={genre}
              variant="outlined"
              onChange={event => this.handleFieldChange('genre', event.target.value)}>
              {genreData.map((genreItem, index) => (
                <MenuItem key={genreItem + '-' + index} value={genreItem}>
                  {genreItem}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className={classes.field}>
           <TextField
  fullWidth
  multiline
  rows={4}
  className={classes.textField}
  label="Description"
  margin="normal"
  required
  variant="outlined"
  value={description}
  onChange={e => this.handleFieldChange('description', e.target.value)}
/>

          </div>

          <Typography variant="subtitle2">Available Cinemas</Typography>
          <TextField
  select
  SelectProps={{ multiple: true }}
  className={classes.textField}
  label="Select Cinemas"
  margin="dense"
  value={cinemaIds}
  variant="outlined"
  onChange={event => this.handleFieldChange('cinemaIds', event.target.value)}
>
  {cinemas.map(cinema => (
    <MenuItem key={cinema._id} value={cinema._id}>
      {cinema.name} - {cinema.city}
    </MenuItem>
  ))}
</TextField>

        {/* {cinemas.map(cinema => (
          <Typography key={cinema._id}>
            {cinema.name} - {cinema.city}
          </Typography>
        ))} */}


          <div className={classes.field}>
            <TextField
              select
              className={classes.textField}
              label="Language"
              margin="dense"
              required
              value={language}
              variant="outlined"
              onChange={event => this.handleFieldChange('language', event.target.value)}>
              {languageData.map((langItem, index) => (
                <MenuItem key={langItem + '-' + index} value={langItem}>
                  {langItem}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              className={classes.textField}
              label="Duration"
              margin="dense"
              type="number"
              value={duration}
              variant="outlined"
              onChange={event => this.handleFieldChange('duration', event.target.value)}
            />
          </div>

          <div className={classes.field}>
            <TextField
              className={classes.textField}
              label="Director"
              margin="dense"
              required
              value={director}
              variant="outlined"
              onChange={event => this.handleFieldChange('director', event.target.value)}
            />
            <TextField
              className={classes.textField}
              label="Cast"
              margin="dense"
              required
              value={cast}
              variant="outlined"
              onChange={event => this.handleFieldChange('cast', event.target.value)}
            />
          </div>

          <div className={classes.field}>
          </div>

          <div className={classes.field}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="release-date"
                label="Release Date"
                value={releaseDate}
                onChange={date => this.handleFieldChange('releaseDate', date._d)}
                KeyboardButtonProps={{ 'aria-label': 'change date' }}
              />
              <KeyboardDatePicker
                className={classes.textField}
                inputVariant="outlined"
                margin="normal"
                id="end-date"
                label="End Date"
                value={endDate}
                onChange={date => this.handleFieldChange('endDate', date._d)}
                KeyboardButtonProps={{ 'aria-label': 'change date' }}
              />
            </MuiPickersUtilsProvider>
          </div>

          <div className={classes.field}>
            <FileUpload
              className={classes.upload}
              file={image}
              onUpload={event => {
                const file = event.target.files[0];
                this.handleFieldChange('image', file);
              }}
            />
          </div>
        </form>

        <Button
          className={classes.buttonFooter}
          color="primary"
          variant="contained"
          onClick={submitAction}>
          {submitButton}
        </Button>
        {this.props.edit && (
          <Button
            color="secondary"
            className={classes.buttonFooter}
            variant="contained"
            onClick={this.onRemoveMovie}>
            Delete Movie
          </Button>
        )}
      </div>
    );
  }
}

AddMovie.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  movie: PropTypes.object
};

const mapStateToProps = ({ movieState }) => ({
  movies: movieState.movies
});

const mapDispatchToProps = { addMovie, updateMovie, removeMovie };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddMovie));