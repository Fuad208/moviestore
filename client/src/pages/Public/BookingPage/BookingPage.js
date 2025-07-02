  // BookingPage.js
  import React, { Component } from 'react';
  import PropTypes from 'prop-types';
  import { connect } from 'react-redux';
  import { withStyles, Grid, Container, Box } from '@material-ui/core';
  import jsPDF from 'jspdf';

  import {
    getMovie,
    getCinemasUserModeling,
    getCinema,
    getCinemas,
    getShowtimes,
    getReservations,
    getSuggestedReservationSeats,
    setSelectedSeats,
    setSelectedCinema,
    setSelectedDate,
    setSelectedTime,
    setInvitation,
    toggleLoginPopup,
    showInvitationForm,
    resetCheckout,
    setAlert,
    addReservation,
    setSuggestedSeats,
    setQRCode
  } from '../../../store/actions';

  import { ResponsiveDialog } from '../../../components';
  import LoginForm from '../Login/components/LoginForm';
  import styles from './styles';
  import MovieInfo from './components/MovieInfo/MovieInfo';
  import BookingForm from './components/BookingForm/BookingForm';
  import BookingSeats from './components/BookingSeats/BookingSeats';
  import BookingCheckout from './components/BookingCheckout/BookingCheckout';
  import BookingInvitation from './components/BookingInvitation/BookingInvitation';

  class BookingPage extends Component {
    didSetSuggestion = false;

    componentDidMount() {
      const {
        user,
        match,
        getMovie,
        getCinemas,
        getCinemasUserModeling,
        getShowtimes,
        getReservations,
        getSuggestedReservationSeats
      } = this.props;

      getMovie(match.params.id);
      user ? getCinemasUserModeling(user.username) : getCinemas();
      getShowtimes();
      getReservations();
      if (user) getSuggestedReservationSeats(user.username);
    }

    componentDidUpdate(prevProps) {
      const { selectedCinema, selectedDate, getCinema } = this.props;
      if ((selectedCinema && prevProps.selectedCinema !== selectedCinema) ||
          (selectedCinema && prevProps.selectedDate !== selectedDate)) {
        getCinema(selectedCinema);
      }
    }

    jsPdfGenerator = () => {
      const { movie, cinema, selectedDate, selectedTime, QRCode } = this.props;
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(movie.title, 20, 20);
      doc.setFontSize(16);
      doc.text(cinema.name, 20, 30);
      doc.text(`Date: ${new Date(selectedDate).toLocaleDateString()} - Time: ${selectedTime}`, 20, 40);
      doc.addImage(QRCode, 'JPEG', 15, 40, 160, 160);
      doc.save(`${movie.title}-${cinema.name}.pdf`);
    };

onSelectSeat = (row, seat) => {
  const { selectedSeats, setSelectedSeats } = this.props;

  const isAlreadySelected = selectedSeats.some(([r, s]) => r === row && s === seat);
  const updatedSelectedSeats = isAlreadySelected
    ? selectedSeats.filter(([r, s]) => !(r === row && s === seat))
    : [...selectedSeats, [row, seat]];

  setSelectedSeats(updatedSelectedSeats);
};

    async checkout() {
      const {
        selectedSeats,
        isAuth,
        toggleLoginPopup,
        addReservation,
        setQRCode,
        getReservations,
        showInvitationForm,
        movie,
        cinema,
        selectedDate,
        selectedTime,
        user,
        setAlert
      } = this.props;

      if (!selectedSeats.length) {
        setAlert('Silakan pilih kursi terlebih dahulu.', 'error');
        return;
      }

      if (!isAuth) {
        toggleLoginPopup();
        return;
      }

      const startAt = Array.isArray(selectedTime) ? selectedTime[0] : selectedTime;
      if (!user?.username || !user?.phone || !startAt) {
        setAlert('Profil atau waktu belum lengkap.', 'error');
        return;
      }

      const payload = {
        username: user.username,
        phone: user.phone,
        movieId: movie?._id,
        cinemaIds: cinema?._id,
        date: selectedDate,
        startAt,
        seats: selectedSeats,
        ticketPrice: cinema.ticketPrice,
        total: selectedSeats.length * cinema.ticketPrice
      };

      try {
        const res = await addReservation(payload);
        if (res?.status === 'success') {
          setQRCode(res.data.QRCode);
          await getReservations();
          showInvitationForm();
        } else {
          setAlert(`Booking gagal: ${res?.message || 'Unknown error'}`, 'error');
        }
      } catch (err) {
        setAlert(`Terjadi kesalahan sistem: ${err.message}`, 'error');
      }
    }

    onFilterCinema() {
      const { cinemas, showtimes, selectedCinema, selectedTime } = this.props;
      const initialReturn = { uniqueCinemas: [], uniqueTimes: [] };
      if (!showtimes || !cinemas) return initialReturn;

      const uniqueCinemasId = [...new Set(
        showtimes
          .filter(showtime => (selectedTime ? showtime.startAt === selectedTime : true))
          .map(showtime => showtime.cinemaIds)
      )];

      const uniqueCinemas = cinemas.filter(cinema => uniqueCinemasId.includes(cinema._id));

      const uniqueTimes = [...new Set(
        showtimes
          .filter(showtime => (selectedCinema ? selectedCinema === showtime.cinemaIds : true))
          .map(showtime => showtime.startAt)
      )].sort((a, b) => new Date(`1970/01/01 ${a}`) - new Date(`1970/01/01 ${b}`));

      return { uniqueCinemas, uniqueTimes };
    }

    onGetReservedSeats = () => {
      const { reservations, cinema, selectedDate, selectedTime } = this.props;
      if (!cinema?.seats || !Array.isArray(cinema.seats)) return [];

      const newSeats = cinema.seats.map(row => Array.isArray(row) ? [...row] : []);

      reservations.filter(r =>
        new Date(r.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString() &&
        r.startAt === selectedTime
      ).flatMap(r => r.seats).forEach(([row, seat]) => {
        if (newSeats[row] && newSeats[row][seat] !== undefined) {
          newSeats[row][seat] = 1;
        }
      });

      return newSeats;
    };

    render() {
      const {
        classes,
        user,
        movie,
        cinema,
        showtimes,
        selectedSeats,
        selectedCinema,
        selectedDate,
        selectedTime,
        showLoginPopup,
        toggleLoginPopup,
        showInvitation,
        invitations,
        setInvitation,
        resetCheckout,
        suggestedSeats,
        suggestedSeat
      } = this.props;

      const { uniqueCinemas, uniqueTimes } = this.onFilterCinema();
      let seats = this.onGetReservedSeats();
      const seatsAvailable = seats.flat().filter(seat => seat === 0).length;

      return (
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={2} style={{ height: '100%' }}>
            <MovieInfo movie={movie} />
            <Grid item lg={9} xs={12} md={12}>
              <BookingForm
                cinemas={uniqueCinemas}
                times={uniqueTimes}
                showtimes={showtimes}
                selectedCinema={selectedCinema}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onChangeCinema={e => this.props.setSelectedCinema(e.target.value)}
                onChangeDate={date => this.props.setSelectedDate(date)}
                onChangeTime={e => this.props.setSelectedTime(e.target.value)}
                onSeatSelected={(seats) => this.props.setSelectedSeats(seats)}
              />
              {showInvitation && !!selectedSeats.length ? (
                <BookingInvitation
                  selectedSeats={selectedSeats}
                  sendInvitations={this.sendInvitations}
                  ignore={resetCheckout}
                  invitations={invitations}
                  onSetInvitation={setInvitation}
                  onDownloadPDF={this.jsPdfGenerator}
                />
              ) : cinema && selectedCinema && selectedTime ? (
                <>
                  <BookingCheckout
                    user={user}
                    ticketPrice={cinema.ticketPrice}
                    seatsAvailable={seatsAvailable}
                    selectedSeats={selectedSeats.length}
                    onBookSeats={() => this.checkout()}
                  />
                </>
              ) : (
                <Box textAlign="center" color="white" mt={2}>
                </Box>
              )
              }
            </Grid>
          </Grid>

          <ResponsiveDialog
            id="Edit-cinema"
            open={showLoginPopup}
            handleClose={() => toggleLoginPopup()}
            maxWidth="sm"
          >
            <LoginForm />
          </ResponsiveDialog>
        </Container>
      );
    }
  }

  BookingPage.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  const mapStateToProps = ({
    authState,
    movieState,
    cinemaState,
    showtimeState,
    reservationState,
    checkoutState
  }, ownProps) => ({
    isAuth: authState.isAuthenticated,
    user: authState.user,
    movie: movieState.selectedMovie,
    cinema: cinemaState.selectedCinema,
    cinemas: cinemaState.cinemas,
    showtimes: showtimeState.showtimes.filter(s => s.movieId === ownProps.match.params.id),
    reservations: reservationState.reservations,
    selectedSeats: checkoutState.selectedSeats,
    suggestedSeat: checkoutState.suggestedSeat,
    selectedCinema: checkoutState.selectedCinema,
    selectedDate: checkoutState.selectedDate,
    selectedTime: checkoutState.selectedTime,
    showLoginPopup: checkoutState.showLoginPopup,
    showInvitation: checkoutState.showInvitation,
    invitations: checkoutState.invitations,
    QRCode: checkoutState.QRCode,
    suggestedSeats: reservationState.suggestedSeats
  });

  export default connect(mapStateToProps, {
    getMovie,
    getCinema,
    getCinemasUserModeling,
    getCinemas,
    getShowtimes,
    getReservations,
    getSuggestedReservationSeats,
    addReservation,
    setSelectedSeats,
    setSuggestedSeats,
    setSelectedCinema,
    setSelectedDate,
    setSelectedTime,
    setInvitation,
    toggleLoginPopup,
    showInvitationForm,
    resetCheckout,
    setAlert,
    setQRCode
  })(withStyles(styles)(BookingPage));
