import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faDownload } from '@fortawesome/free-solid-svg-icons';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

function BookingHistory() {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (userId) {
      const fetchBookingHistory = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/movieapi/booking_history/${userId}`);
          setBookings(response.data);
        } catch (error) {
          console.error('Error fetching booking history:', error);
          setError('Error fetching booking history. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchBookingHistory();
    }
  }, [userId]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const generatePDF = async (booking) => {
    const { booking_id, film_name, date, time, no_of_seats, ticket_price, total_price } = booking;
    const doc = new jsPDF();

    // Add movie title
    doc.setFontSize(20);
    doc.setFont('bold');
    doc.text(film_name, 10, 20);

    // Add booking details
    doc.setFontSize(12);
    doc.setFont('normal');
    doc.text(`Booking ID: ${booking_id}`, 10, 30);
    doc.text(`Date: ${date}`, 10, 40);
    doc.text(`Time: ${time}`, 10, 50);
    doc.text(`Seats: ${no_of_seats}`, 10, 60);
    doc.text(`Ticket Price: ${ticket_price}`, 10, 70);
    doc.text(`Total Price: ${total_price}`, 10, 80);

    // Generate QR code
    const qrData = JSON.stringify({
      booking_id,
      film_name,
      date,
      time,
      no_of_seats,
      ticket_price,
      total_price
    });
    const canvas = await QRCode.toCanvas(qrData);
    const imageData = canvas.toDataURL('image/jpeg');
    doc.addImage(imageData, 'JPEG', 10, 100, 80, 80);

    // Save the PDF with movie name as filename
    doc.save(`${film_name}.pdf`);
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.film_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Booking History</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by movie name"
          value={filter}
          onChange={handleFilterChange}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faFilter} />
          </span>
        </div>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center">Error: {error}</div>
      ) : filteredBookings.length === 0 ? (
        <p className="text-center">No previous bookings</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr className="table-dark">
              <th>Booking ID</th>
              <th>Movie</th>
              <th>Date</th>
              <th>Time</th>
              <th>Seats</th>
              <th>Ticket Price</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_id}</td>
                <td>{booking.film_name}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.no_of_seats}</td>
                <td>{booking.ticket_price}</td>
                <td>{booking.total_price}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => generatePDF(booking)}>
                    <FontAwesomeIcon icon={faDownload} /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style>
        {`
          /* Hover effect on table rows */
          .table-hover tbody tr:hover {
            background-color: #f5f5f5; /* Light gray background color on hover */
          }

          /* Make row heading text black */
          .table-dark th {
            color: black;
          }
        `}
      </style>
    </div>
  );
}

export default BookingHistory;
