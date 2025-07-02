import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CustomizedSnackbar from '../CustomizedSnackbar/';

const TimedAlert = ({ alert }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 3000); // 3 detik
    return () => clearTimeout(timer);
  }, []);

  return (
    <CustomizedSnackbar
      isOpen={open}
      vertical="top"
      horizontal="right"
      variant={alert.alertType}
      message={alert.msg}
    />
  );
};

TimedAlert.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.string,
    msg: PropTypes.string,
    alertType: PropTypes.string
  }).isRequired
};

const Alert = ({ alerts }) =>
  alerts.length > 0 &&
  alerts.map((alert, index) => (
    <TimedAlert key={`custom-alert-${index}-${alert.id}`} alert={alert} />
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

Alert.defaultProps = {
  alerts: []
};

const mapStateToProps = (state) => ({
  alerts: state.alertState.alerts
});

export default connect(mapStateToProps)(Alert);
