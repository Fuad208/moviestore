import { GET_RESERVATIONS, GET_RESERVATION_SUGGESTED_SEATS } from '../types';
import { setAlert } from './alert';

// ✅ Ambil semua reservasi
export const getReservations = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const reservations = await response.json();
    if (response.ok) {
      dispatch({ type: GET_RESERVATIONS, payload: reservations });
    } else {
      dispatch(setAlert(reservations.message || 'Gagal mengambil reservasi', 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message || 'Kesalahan sistem saat mengambil reservasi', 'error', 5000));
  }
};

// ✅ Ambil saran kursi berdasarkan user
export const getSuggestedReservationSeats = username => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = `/reservations/usermodeling/${username}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const reservationSeats = await response.json();
    if (response.ok) {
      dispatch({
        type: GET_RESERVATION_SUGGESTED_SEATS,
        payload: reservationSeats
      });
    } else {
      dispatch(setAlert(reservationSeats.message || 'Gagal mengambil saran kursi', 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message || 'Kesalahan sistem saat mengambil saran kursi', 'error', 5000));
  }
};

// ✅ Tambah reservasi (booking)
export const addReservation = reservation => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = '/reservations';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservation)
    });

    const resData = await response.json();

    if (response.ok) {
      const { reservation, QRCode } = resData;
      dispatch(setAlert('Reservasi berhasil dibuat', 'success', 5000));
      return {
        status: 'success',
        message: 'Reservasi berhasil dibuat',
        data: { reservation, QRCode }
      };
    } else {
      dispatch(setAlert(resData.message || 'Gagal membuat reservasi', 'error', 5000));
      return {
        status: 'error',
        message: resData.message || 'Gagal membuat reservasi'
      };
    }
  } catch (error) {
    dispatch(setAlert(error.message || 'Terjadi kesalahan sistem', 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Terjadi kesalahan sistem saat membuat reservasi'
    };
  }
};

// ✅ Perbarui reservasi
export const updateReservation = (reservation, id) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = `/reservations/${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservation)
    });

    const resData = await response.json();

    if (response.ok) {
      dispatch(setAlert('Reservasi berhasil diperbarui', 'success', 5000));
      return { status: 'success', message: 'Reservasi berhasil diperbarui' };
    } else {
      dispatch(setAlert(resData.message || 'Gagal memperbarui reservasi', 'error', 5000));
      return {
        status: 'error',
        message: resData.message || 'Gagal memperbarui reservasi'
      };
    }
  } catch (error) {
    dispatch(setAlert(error.message || 'Terjadi kesalahan sistem', 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Terjadi kesalahan saat memperbarui reservasi'
    };
  }
};

// ✅ Hapus reservasi
export const removeReservation = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const url = `/reservations/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const resData = await response.json();

    if (response.ok) {
      dispatch(setAlert('Reservasi berhasil dihapus', 'success', 5000));
      return { status: 'success', message: 'Reservasi berhasil dihapus' };
    } else {
      dispatch(setAlert(resData.message || 'Gagal menghapus reservasi', 'error', 5000));
      return {
        status: 'error',
        message: resData.message || 'Gagal menghapus reservasi'
      };
    }
  } catch (error) {
    dispatch(setAlert(error.message || 'Terjadi kesalahan sistem', 'error', 5000));
    return {
      status: 'error',
      message: error.message || 'Terjadi kesalahan saat menghapus reservasi'
    };
  }
};
