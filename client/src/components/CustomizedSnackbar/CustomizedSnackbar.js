import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from '../SnackbarContentWrapper/SnackbarContentWrapper';


const CustomizedSnackbar = (props) => {
  const {
    isOpen,
    vertical = 'top',
    horizontal = 'center',
    variant = 'info',
    message = '',
    onClose,
  } = props;

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={isOpen}
      onClose={onClose}
      autoHideDuration={3000}
    >
      <SnackbarContentWrapper
        onClose={onClose}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
};

CustomizedSnackbar.propTypes = {
  isOpen: PropTypes.bool,
  vertical: PropTypes.string,
  horizontal: PropTypes.string,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  message: PropTypes.string,
  onClose: PropTypes.func,
};

export default CustomizedSnackbar;
