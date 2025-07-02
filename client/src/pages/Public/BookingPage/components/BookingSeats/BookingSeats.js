import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  rowLabel: {
    color: '#fff',
    width: 20,
    marginRight: theme.spacing(1),
    textAlign: 'right',
    fontWeight: 600,
  },
  seat: {
    cursor: 'pointer',
    color: '#fff',
    borderRadius: 4,
    padding: theme.spacing(1),
    margin: theme.spacing(0.5),
    fontWeight: 600,
    fontSize: 12,
    textAlign: 'center',
    minWidth: 32,
    '&:hover': {
      opacity: 0.9,
    },
  },
  hiddenSeat: {
    visibility: 'hidden',
    margin: theme.spacing(0.5),
    minWidth: 32,
  },
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    color: '#eee',
    marginTop: theme.spacing(4),
  },
  legendItem: {
    margin: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
  },
  legendBox: {
    width: 14,
    height: 14,
    marginRight: theme.spacing(1),
    borderRadius: 2,
  },
}));

const getSeatColor = status => {
  switch (status) {
    case 0: return 'rgb(65, 66, 70)';     // Reserved
    case 1: return 'rgb(96, 93, 169)';    // Available
    case 2: return 'rgb(120, 205, 4)';    // Selected
    case 3: return 'rgb(14, 151, 218)';   // Recommended
    default: return 'gray';
  }
};

export default function BookingSeats({ seats = [], onSelectSeat }) {
  const classes = useStyles();

  const isValid = Array.isArray(seats) &&
    seats.length > 0 &&
    seats.every(row => row && Array.isArray(row.seats));

  return (
    <>
      <Box width={1} pt={4}>
        {isValid ? (
          seats.map((row, rowIndex) => (
            <div key={rowIndex} className={classes.row}>
              <div className={classes.rowLabel}>{row.label}</div>
              {row.seats.map((seat, colIndex) => {
                if (seat === null) {
                  return (
                    <div key={colIndex} className={classes.hiddenSeat}>
                      -
                    </div>
                  );
                }

                const seatNumber = `${row.label}${colIndex + 1}`;

                return (
                  <Box
                    key={`seat-${rowIndex}-${colIndex}`}
                    className={classes.seat}
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => onSelectSeat && onSelectSeat(rowIndex, colIndex)}
                  >
                    {seatNumber}
                  </Box>
                );
              })}
            </div>
          ))
        ) : (
          <Typography align="center" color="textSecondary">
            Seats not available.
          </Typography>
        )}
      </Box>

      {/* Legend - hanya ditampilkan jika kursi valid */}
      {isValid && (
        <Box className={classes.legendContainer}>
          <div className={classes.legendItem}>
            <div className={classes.legendBox} style={{ backgroundColor: 'rgb(96, 93, 169)' }} />
            Seat Available
          </div>
          <div className={classes.legendItem}>
            <div className={classes.legendBox} style={{ backgroundColor: 'rgb(65, 66, 70)' }} />
            Reserved Seat
          </div>
          <div className={classes.legendItem}>
            <div className={classes.legendBox} style={{ backgroundColor: 'rgb(120, 205, 4)' }} />
            Selected Seat
          </div>
          <div className={classes.legendItem}>
            <div className={classes.legendBox} style={{ backgroundColor: 'rgb(14, 151, 218)' }} />
            Recommended Seat
          </div>
        </Box>
      )}
    </>
  );
}
