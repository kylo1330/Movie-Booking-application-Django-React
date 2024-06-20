import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import checkAuth from '../auth/checkAuth';

function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({
    title: '',
    release_date: '',
    description: '',
    genre: '',
    poster: '',
    showId: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  // Function to format release date
  const formatReleaseDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If date is invalid, return original date string
        return dateString;
      }
      // Format valid date
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      console.error('Error formatting release date:', error);
      return dateString; // Return original date string in case of error
    }
  };

  useEffect(() => {
    if (user && user.token) {
      axios
        .get(`http://127.0.0.1:8000/movieapi/movie_detail_user/${movieId}/`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then((response) => {
          setMovie(response.data);
          setLoading(false);
          setError('');
        })
        .catch((error) => {
          console.error('Error fetching movie details:', error);
          setError('Failed to fetch movie details. Please try again later.');
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [movieId, user, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card" style={{ minHeight: '200px' }}>
                <div className="card-body">
                  <p>Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card" style={{ minHeight: '200px' }}>
                <div className="card-body">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card" style={{ minHeight: '200px' }}>
              <div className="card-header">
                <h3>{movie.title}</h3>
                <small>Release Date: {formatReleaseDate(movie.release_date)}</small>
              </div>
              <div className="card-body">
                <p>About: {movie.description}</p>
                <p>Genre: {movie.genre}</p>
                <img
                  src={`http://127.0.0.1:8000${movie.poster}`}
                  alt="Movie Poster"
                  className="img-fluid"
                />
                <Link
                  to={`/BookingForm/${movie.id}/${encodeURIComponent(movie.title)}`}
                  state={{ movieData: movie }}
                  className="btn btn-danger col-12 mt-2"
                >
                  Book tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default checkAuth(MovieDetails);
