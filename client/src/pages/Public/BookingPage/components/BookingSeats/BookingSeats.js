// BookingSeats.js
import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  rowLabel: {
    color: 'white',
    width: 20,
    marginRight: theme.spacing(1),
    textAlign: 'right'
  },
  seat: {
    cursor: 'pointer',
    color: '#fff',
    borderRadius: 4,
    padding: theme.spacing(1.2, 1.6),
    margin: theme.spacing(0.5),
    fontWeight: 600,
    fontSize: 12,
    textAlign: 'center',
    minWidth: 32,
    '&:hover': {
      backgroundColor: 'rgb(120, 205, 4)',
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
  }
}));

const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function BookingSeats({ seats = [], onSelectSeat }) {
  const classes = useStyles();
  const isValidSeats =
    Array.isArray(seats) &&
    seats.length > 0 &&
    seats.every(row => Array.isArray(row));

  return (
    <Fragment>
      <Box width={1} pt={5}>
        {isValidSeats ? (
          seats.map((row, rowIndex) => (
            <div key={rowIndex} className={classes.row}>
              <div className={classes.rowLabel}>{rowLabels[rowIndex]}</div>
              {row.map((seat, colIndex) => {
                if (seat === null) {
                  return <div key={colIndex} className={classes.hiddenSeat}>-</div>;
                }
                const seatNumber = `${rowLabels[rowIndex]}${colIndex + 1}`;
                const bgColor =
                  seat === 1
                    ? 'rgb(65, 66, 70)'     // Reserved
                    : seat === 2
                    ? 'rgb(120, 205, 4)'    // Selected
                    : seat === 3
                    ? 'rgb(14, 151, 218)'   // Recommended
                    : 'rgb(96, 93, 169)';   // Available
                return (
                  <Box
                    key={`seat-${rowIndex}-${colIndex}`}
                    className={classes.seat}
                    style={{ backgroundColor: bgColor }}
                    onClick={() => onSelectSeat(rowIndex, colIndex)}
                  >
                    {seatNumber}
                  </Box>
                );
              })}
            </div>
          ))
        ) : (
          <Typography align="center" color="textSecondary">Seats not available.</Typography>
        )}
      </Box>

      {/* Legend */}
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
    </Fragment>
  );
}
