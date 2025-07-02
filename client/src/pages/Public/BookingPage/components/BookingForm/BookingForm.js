import React, { useState } from 'react';
import {
  Grid,
  Box,
  TextField,
  MenuItem,
  Typography
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import BookingSeats from '../BookingSeats/BookingSeats';

export default function BookingForm(props) {
  const {
    cinemas,
    showtimes,
    selectedCinema,
    onChangeCinema,
    selectedDate,
    onChangeDate,
    times,
    selectedTime,
    onChangeTime,
    onSeatSelected
  } = props;

  // ✅ Tambahkan state untuk seats
  const [seats, setSeats] = useState([
    { label: 'A', seats: [1, 1, 0, 1, 1] },
    { label: 'B', seats: [1, null, 0, 1, 3] },
    { label: 'C', seats: [1, 2, 2, 1, 0] },
  ]);

  // ✅ Fungsi untuk menangani klik pada kursi
  const handleSelectSeat = (rowIndex, colIndex) => {
    setSeats(prevSeats => {
      const updated = [...prevSeats];
      const row = { ...updated[rowIndex] };
      const seatsInRow = [...row.seats];

      const currentStatus = seatsInRow[colIndex];
      if (currentStatus === 0 || currentStatus === null) return updated;

      seatsInRow[colIndex] = currentStatus === 2 ? 1 : 2;

      updated[rowIndex] = {
        ...row,
        seats: seatsInRow
      };
      const selected = updated.flatMap((row, rIndex) =>
        row.seats.map((s, cIndex) => (s === 2 ? [rIndex, cIndex] : null)).filter(Boolean)
      );

      // ✅ Kirim ke parent (BookingPage) untuk update Redux
      if (onSeatSelected) onSeatSelected(selected);

      return updated;
    });
  };

  // Cari showtime berdasarkan cinema yang dipilih
  const showtime = showtimes.find(
    showtime => showtime.cinemaIds === selectedCinema
  );

  // Jika tidak ada cinema tersedia, tampilkan pesan
  if (!cinemas.length) {
    return (
      <Box
        display="flex"
        width={1}
        height={1}
        alignItems="center"
        justifyContent="center">
        <Typography align="center" variant="h2" color="inherit">
          No Cinema Available.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Dropdown Cinema */}
      <Grid item xs>
        <TextField
          fullWidth
          select
          value={selectedCinema}
          label="Select Cinema"
          variant="outlined"
          onChange={onChangeCinema}>
          {cinemas.map(cinema => (
            <MenuItem key={cinema._id} value={cinema._id}>
              {cinema.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Tanggal Tersedia */}
      {showtime && (
        <Grid item xs>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              inputVariant="outlined"
              margin="none"
              fullWidth
              id="start-date"
              label="Start Date"
              format="MM/DD/YYYY"
              minDate={new Date(showtime.startDate)}
              maxDate={new Date(showtime.endDate)}
              value={selectedDate}
              onChange={(date) => onChangeDate(date ? date.toDate() : null)}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      )}

      {/* Waktu tersedia */}
      {selectedDate && Array.isArray(times) && times.length > 0 && (
        <Grid item xs>
          <TextField
            fullWidth
            select
            value={selectedTime}
            label="Select Time"
            variant="outlined"
            onChange={onChangeTime}>
            {times.map((time, index) => (
              <MenuItem key={time + '-' + index} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      )}

      {/* Tampilan tempat duduk */}
      {selectedTime && (
        <Grid item xs={12}>
          <BookingSeats
            seats={seats}
            onSelectSeat={handleSelectSeat}
          />
        </Grid>
      )}
    </Grid>
  );
}
