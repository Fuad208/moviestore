import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles, Grid, Container, Box } from '@material-ui/core';
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
import jsPDF from 'jspdf';

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
    if (
      (selectedCinema && prevProps.selectedCinema !== selectedCinema) ||
      (selectedCinema && prevProps.selectedDate !== selectedDate)
    ) {
      getCinema(selectedCinema);
    }
  }

  jsPdfGenerator = () => {
    const { movie, cinema, selectedDate, selectedTime, QRCode } = this.props;
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontType('bold');
    doc.setFontSize(22);
    doc.text(movie.title, 20, 20);
    doc.setFontSize(16);
    doc.text(cinema.name, 20, 30);
    doc.text(`Date: ${new Date(selectedDate).toLocaleDateString()} - Time: ${selectedTime}`, 20, 40);
    doc.addImage(QRCode, 'JPEG', 15, 40, 160, 160);
    doc.save(`${movie.title}-${cinema.name}.pdf`);
  };

  onSelectSeat = (row, seat) => {
  const { cinema, selectedSeats, setSelectedSeats } = this.props;
  const seats = cinema?.seats ? [...cinema.seats.map(r => [...r])] : [];
  if (!seats[row] || seats[row][seat] === undefined) return;

  if (seats[row][seat] === 1) return;

  let updatedSelectedSeats = [...selectedSeats];

  if (seats[row][seat] === 2) {
    seats[row][seat] = 0;
    updatedSelectedSeats = updatedSelectedSeats.filter(
      ([r, s]) => !(r === row && s === seat)
    );
  } else {
    seats[row][seat] = 2;
    updatedSelectedSeats.push([row, seat]);
  }

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
    cinemaId: cinema?._id,
    date: selectedDate,
    startAt: startAt, // ⬅️ string saja, bukan array
    seats: selectedSeats,
    ticketPrice: cinema.ticketPrice,
    total: selectedSeats.length * cinema.ticketPrice
  };

  try {
    console.log('Booking payload:', payload);
    const res = await addReservation(payload);

    if (res?.status === 'success') {
      setQRCode(res.data.QRCode);
      await getReservations();
      showInvitationForm();
    } else {
      console.error('Booking failed', res);
      setAlert(`Booking gagal: ${res?.message || 'Unknown error'}`, 'error');
    }
  } catch (err) {
    console.error(err);
    setAlert(`Terjadi kesalahan sistem: ${err.message}`, 'error');
  }
}




  bookSeats() {
    const { cinema } = this.props;
    if (!cinema?.seats) return [];

    return cinema.seats
      .flatMap((row, rowIndex) =>
        row.map((seat, seatIndex) => (seat === 2 ? [rowIndex, seatIndex] : null)).filter(Boolean)
      );
  }

  onFilterCinema() {
    const { cinemas, showtimes, selectedCinema, selectedTime } = this.props;
    const initialReturn = { uniqueCinemas: [], uniqueTimes: [] };
    if (!showtimes || !cinemas) return initialReturn;

    const uniqueCinemasId = showtimes
      .filter(showtime => (selectedTime ? showtime.startAt === selectedTime : true))
      .map(showtime => showtime.cinemaId)
      .filter((value, index, self) => self.indexOf(value) === index);

    const uniqueCinemas = cinemas.filter(cinema => uniqueCinemasId.includes(cinema._id));

    const uniqueTimes = showtimes
      .filter(showtime => (selectedCinema ? selectedCinema === showtime.cinemaId : true))
      .map(showtime => showtime.startAt)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => new Date(`1970/01/01 ${a}`) - new Date(`1970/01/01 ${b}`));

    return { ...initialReturn, uniqueCinemas, uniqueTimes };
  }

  onGetReservedSeats = () => {
    const { reservations, cinema, selectedDate, selectedTime } = this.props;
    if (!cinema?.seats) return [];

    const newSeats = cinema.seats.map(row => [...row]);
    const filteredReservations = reservations.filter(
      reservation =>
        new Date(reservation.date).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString() &&
        reservation.startAt === selectedTime
    );

    filteredReservations
      .flatMap(reservation => reservation.seats)
      .forEach(([row, seat]) => {
        if (newSeats[row]) newSeats[row][seat] = 1;
      });

    return newSeats;
  };

  onGetSuggestedSeats = (seats, suggestedSeats) => {
    const { numberOfTickets, positions } = suggestedSeats;
    const positionsArray = Object.entries(positions).sort((a, b) => b[1] - a[1]);

    if (positionsArray.every(position => position[1] === 0)) return;

    const step = Math.round(seats.length / 3);
    for (let [zone] of positionsArray) {
      let indexArr =
        zone === 'front' ? [0, step] : zone === 'center' ? [step, step * 2] : [step * 2, seats.length];
      const suggested = this.checkSeats(indexArr, seats, numberOfTickets);
      if (suggested) {
        this.getSeat(suggested, seats, numberOfTickets);
        break;
      }
    }
  };

  checkSeats = (indexArr, seats, numberOfTickets) => {
    for (let i = indexArr[0]; i < indexArr[1]; i++) {
      for (let j = 0; j <= seats[i].length - numberOfTickets; j++) {
        if (seats[i].slice(j, j + numberOfTickets).every(seat => !seat)) {
          return [i, j];
        }
      }
    }
    return null;
  };

  getSeat = (suggested, seats, numberOfTickets) => {
    const { setSuggestedSeats } = this.props;
    const seatsToSet = [];
    for (let i = suggested[1]; i < suggested[1] + numberOfTickets; i++) {
      seatsToSet.push([suggested[0], i]);
    }
    setSuggestedSeats(seatsToSet);
  };

  onChangeCinema = event => this.props.setSelectedCinema(event.target.value);
  onChangeDate = date => this.props.setSelectedDate(date);
  onChangeTime = event => this.props.setSelectedTime(event.target.value);

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
    if (suggestedSeats && selectedTime && !suggestedSeat.length) {
      this.onGetSuggestedSeats(seats, suggestedSeats);
    }
    if (suggestedSeat.length && !this.didSetSuggestion) {
      suggestedSeat.forEach(([row, seat]) => {
        if (seats[row]) seats[row][seat] = 3;
      });
      this.didSetSuggestion = true;
    }
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
              onChangeCinema={this.onChangeCinema}
              onChangeDate={this.onChangeDate}
              onChangeTime={this.onChangeTime}
            />
            {showInvitation && !!selectedSeats.length && (
              <BookingInvitation
                selectedSeats={selectedSeats}
                sendInvitations={this.sendInvitations}
                ignore={resetCheckout}
                invitations={invitations}
                onSetInvitation={setInvitation}
                onDownloadPDF={this.jsPdfGenerator}
              />
            )}
            {cinema && selectedCinema && selectedTime && !showInvitation ? (
              <>
                <BookingSeats
                  seats={seats}
                  onSelectSeat={(indexRow, index) => this.onSelectSeat(indexRow, index)}
                />
                <BookingCheckout
  user={user}
  ticketPrice={cinema.ticketPrice}
  seatsAvailable={seatsAvailable}
  selectedSeats={selectedSeats.length}
  onBookSeats={() => {
    console.log('Checkout clicked');
    this.checkout();
  }}          
                />
              </>
            ) : (
              <Box textAlign="center" color="white" mt={2}>
                Seats not available.
              </Box>
            )}
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

const mapStateToProps = (
  {
    authState,
    movieState,
    cinemaState,
    showtimeState,
    reservationState,
    checkoutState
  },
  ownProps
) => ({
  isAuth: authState.isAuthenticated,
  user: authState.user,
  movie: movieState.selectedMovie,
  cinema: cinemaState.selectedCinema,
  cinemas: cinemaState.cinemas,
  showtimes: showtimeState.showtimes.filter(
    showtime => showtime.movieId === ownProps.match.params.id
  ),
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

const mapDispatchToProps = {
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
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BookingPage));
