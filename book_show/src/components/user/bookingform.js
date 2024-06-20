import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import checkAuth from '../auth/checkAuth';
import QRCode from 'qrcode.react'; // Import QRCode library

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const BookingForm = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noOfSeats, setNoOfSeats] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');
  const [date, setDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(150);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((store) => store.auth.user);
  const token = user?.token;
  const userId = user ? user.userId : null;

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
    }
  }, [movieId]);

  const fetchMovieDetails = (id) => {
    setLoading(true);
    axios.get(`http://127.0.0.1:8000/movieapi/view_movie/${id}/`)
      .then((response) => {
        setMovie(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
        setError('Failed to fetch movie details. Please try again later.');
        setLoading(false);
      });
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSeatChange = (event) => {
    const numberOfSeats = parseInt(event.target.value, 10);
    if (!isNaN(numberOfSeats) && numberOfSeats > 0) {
      const newTotalPrice = numberOfSeats * (movie?.ticketPrice || 150);
      setNoOfSeats(numberOfSeats);
      setTotalPrice(newTotalPrice);
    }
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const validateForm = () => {
    return date && selectedTime && noOfSeats > 0;
  };

  const handlePayment = async (orderId, amount, bookingDetails) => {
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      setBookingError('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: 'rzp_test_juCSC8R25SR9Jh',
      amount: totalPrice * 100,
      currency: 'INR',
      name: 'Movie Ticket',
      description: 'Booking for movie ticket',
      order_id: orderId,
      handler: async function (response) {
        try {
          setBookingSuccess(true);
          // Navigate to the confirmation page with booking details
          navigate(`/bookingconfirm/${bookingDetails.userId}/${bookingDetails.bookingId}/${bookingDetails.movieTitle}`, {
            state: {
              bookingId: bookingDetails.bookingId,
              title: bookingDetails.movieTitle,
              userId: bookingDetails.userId,
              qrCodeData: bookingDetails.qrCodeData,
            }
          });
        } catch (error) {
          setBookingError('Payment verification failed. Please try again later.');
        }
      },
      prefill: {
        name: user?.name || 'John Doe',
        email: user?.email || 'john.doe@example.com',
        contact: '7306599931',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const addBooking = async () => {
    if (!validateForm()) {
      setBookingError('Please fill all fields correctly.');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const bookingData = {
        movie: movieId,
        date: date,
        time: selectedTime,
        no_of_seats: noOfSeats,
        ticket_price: movie?.ticketPrice || 150,
        total_price: totalPrice,
        film_name: movie?.title || 'unknown',
        amount: totalPrice * 100,
        user_id: userId,
      };

      const response = await axios.post(`
        http://127.0.0.1:8000/movieapi/movie_Booking/${movieId}/`,
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        }
      );

      const { order_id, booking_id, user, amount } = response.data;

      const bookingDetails = {
        bookingId: booking_id,
        amount: amount,
        movieTitle: movie.title,
        userId: user,
        qrCodeData: JSON.stringify({
          bookingId: booking_id,
          userId: user,
          movieId: movieId,
          amount: amount,
        }),
      };

      setBookingDetails(bookingDetails);

      handlePayment(order_id, amount, bookingDetails);
    } catch (error) {
      console.error('Error in movie booking:', error);
      setBookingError('Failed to book the ticket. Please try again later.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {movie && !bookingSuccess && (
        <div className="container d-flex justify-content-center mt-5 mb-5">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="card">
              {bookingError && (
                <div className="alert alert-danger">{bookingError}</div>
              )}
              <div className="card-header" style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 'bold' }}>
                <b>{movie.title}</b>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={handleDateChange}
                  />
                </div>
                <div className="form-group">
                  <label>Show Time:</label>
                  <select
                    className="form-control"
                    value={selectedTime}
                    onChange={handleTimeChange}
                  >
                    <option value="">Select a time</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Seats:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={noOfSeats}
                    onChange={handleSeatChange}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Total Price:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={totalPrice}
                    readOnly
                  />
                </div>
                <div className="form-group text-center">
                  <button
                    className="btn btn-danger"
                    onClick={addBooking}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Booking...' : 'Book Ticket'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default checkAuth(BookingForm);