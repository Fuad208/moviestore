import React from 'react';
import { Divider, Typography, Link } from '@material-ui/core';
import useStyles from './styles';

export default function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Divider />
      <Typography className={classes.copyright} variant="body1">
        Kelompok 5 :Fuad Al Fajri, Rayhan Juliansyah, Farrel Adrian Laksana, Alfa Ramadhan
      </Typography>
    </div>
  );
}