import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';

function ListPosts() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchDate, setSearchDate] = useState(date);
  const [showAll, setShowAll] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      fetchMovies();
    }
  }, [user, searchDate, showAll]);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:8000/movieapi/list_event', {
        headers: { Authorization: `Token ${user.token}` },
      });
      const moviesData = response.data;
      const filteredMovies = showAll ? moviesData : moviesData.filter(movie => movie.release_date === searchDate);
      setMovies(filteredMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchDate(date);
    setShowAll(false);
  };

  const handleShowAllClick = () => {
    setSearchDate('');
    setShowAll(true);
  };

  return (
    <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '20px 0' }}>
      <style>
        {`
          @font-face {
            font-family: 'Material Symbols Outlined';
            src: url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
          }
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined', sans-serif;
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}
      </style>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center my-4">
              <b>Movie List</b>
            </h1>
          </div>
          <div className="col-md-7 offset-md-5 mb-3 d-flex justify-content-end align-items-center">
            <input
              type="date"
              className="form-control form-control-sm me-2"
              style={{ width: '150px' }}
              value={date}
              onChange={handleDateChange}
              aria-label="Select date"
            />
            <button className="btn btn-primary btn-sm me-2" onClick={handleSearchClick}>
              Search
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleShowAllClick}>
              Show All
            </button>
          </div>
        </div>
        <div className="row">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center">No movies available for the selected date. Please search for another date.</div>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-4">
                <div className="card">
                  <div
                    style={{
                      height: '300px',
                      overflow: 'hidden',
                      position: 'relative',
                      filter: movie.enabled ? 'none' : 'grayscale(100%)',
                    }}
                  >
                    <img
                      src={`http://127.0.0.1:8000${movie.poster}`}
                      className="card-img-top"
                      alt={movie.title}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                    {!movie.enabled && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(255, 0, 0, 0.5)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'white',
                          fontSize: '24px',
                        }}
                      >
                        Currently Not Available
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h4 className="card-title" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 'bold' }}>
                      {movie.title}
                    </h4>
                    <p className="card-text" style={{ fontFamily: 'Montserrat, sans-serif' }}>{movie.genre}</p>
                    {movie.enabled && (
                      <div>
                        <Link
                          to={`/BookingForm/${movie.id}/${encodeURIComponent(movie.title)}`}
                          className="btn btn-warning btn-sm mb-3 me-2"
                          style={{ backgroundColor: '#FFD700', borderColor: '#FFD700', color: 'black' }}
                        >
                          Book Tickets
                        </Link>
                        <Link
                          to={`/movie-details/${movie.id}`}
                          className="btn btn-info btn-sm mb-3 material-symbols-outlined"
                        >
                          ℹ️
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ListPosts;
