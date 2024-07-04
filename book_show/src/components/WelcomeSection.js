import React from 'react';
import './WelcomeSection.css'; // Import the CSS file
import { useSelector } from 'react-redux';
import { Link} from "react-router-dom";

const WelcomeSection = () => {
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);

  return (
    <>
      <div className="coming">
        <h2>Coming Soon...</h2>
      </div>
      <div className={`welcome-section ${isSuperuser ? 'admin-login' : ''}`}>
        <h2>Welcome to our Movie Booking Website!</h2>
        <p>Explore the latest movies{!isSuperuser && ' and book your tickets now'}</p>
        {!isSuperuser && (
          <Link to="/user/UserMovieList" className="custom-btn">
      Book Tickets
    </Link>

)}
      </div>
      <div className="bottom-bar">
        <span className="brand">KYLO MOVIES</span>
      </div>
    </>
  );
}

export default WelcomeSection;
