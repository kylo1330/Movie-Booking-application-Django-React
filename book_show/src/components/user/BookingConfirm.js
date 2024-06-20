import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import axios from 'axios';


function ConfirmationPage() {
  const location = useLocation();
  const { bookingId, title, userId } = location.state;
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);

  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleViewHistory = () => {
    navigate(`/BookingHistory/${userId}`);
  };

  // Concatenate bookingId and title into a single string for QR code
  const qrCodeData = `${bookingId}-${title}`;

  return (
    <div className="container-fluid" style={{ backgroundColor: '#444', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5" style={{ width: '100%' }}>
            <div className="card-body">
              <h3 className="card-title">Booking Confirmation</h3>
              <div className="card-text">
                <p><strong>Booking ID:</strong> {bookingId}</p>
                <p><strong>Title:</strong> {title}</p>
              </div>
              {/* Render QR code at bottom center */}
              <div className="text-center mt-5">
                <div className="qr-code" ref={qrCodeRef} style={{ display: 'inline-block', border: '2px solid #333', padding: '10px', borderRadius: '5px', backgroundColor: '#fff' }}>
                  <QRCode value={qrCodeData} />
                </div>
                <div className="text-center mt-3">
                  <button className="btn btn-danger" style={{ marginTop: '20px', borderRadius: '5px', padding: '10px 20px', fontSize: '16px' }} onClick={handleViewHistory}>
                    View My Booking History
                  </button>
                </div>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;




