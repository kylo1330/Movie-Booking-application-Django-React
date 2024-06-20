import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';
import checkAuth from '../auth/checkAuth';
import { Modal, Button } from 'react-bootstrap';

function ListPosts() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [movieIdToDelete, setMovieIdToDelete] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMovies();
    }
  }, [user]);

  function fetchMovies() {
    setLoading(true);
    axios
      .get('http://127.0.0.1:8000/movieapi/list_event', {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then((response) => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setError('Failed to fetch movies. Please try again later.');
        setLoading(false);
      });
  }

  function toggleMovieStatus(event, movieId, enabled) {
    event.preventDefault(); // Prevent default behavior
    setLoading(true);
    axios
      .put(`http://127.0.0.1:8000/movieapi/toggle_movie_status/${movieId}`, { enabled }, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(() => {
        setMovies(prevMovies => prevMovies.map(movie => 
          movie.id === movieId ? { ...movie, enabled: !movie.enabled } : movie
        ));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error toggling movie status:', error);
        setError('Failed to toggle movie status. Please try again later.');
        setLoading(false);
      });
  }

  function handleDeleteClick(event, movieId) {
    event.preventDefault(); // Prevent default behavior
    setMovieIdToDelete(movieId);
    setShowModal(true);
  }

  function handleConfirmDelete() {
    setLoading(true);
    axios
      .delete(`http://127.0.0.1:8000/movieapi/delete_event/${movieIdToDelete}`, {
        headers: { Authorization: `Token ${user.token}` },
      })
      .then(() => {
        setLoading(false);
        setShowModal(false);
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieIdToDelete));
      })
      .catch((error) => {
        console.error('Error deleting movie:', error);
        setError('Failed to delete movie. Please try again later.');
        setLoading(false);
      });
  }

  return (
    <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '20px 0' }}>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center my-4">
              <b>Movie List</b>
            </h1>
            {user && (
              <div>
                <Link to="/admin/posts/create" className="btn btn-danger mb-3">
                  Create Movie
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className="col-md-4 mb-4">
                <div className="card">
                  <div style={{ height: '300px', overflow: 'hidden' }}>
                    <img
                      src={`http://127.0.0.1:8000${movie.poster}`}
                      className="card-img-top"
                      alt={movie.title}
                      style={{ objectFit: 'cover', width: '100%', height: '100%', filter: movie.enabled ? 'none' : 'grayscale(100%)' }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text"> {movie.genre}</p>
                    <p className="card-text"> {movie.description}</p>
                    <p className="card-text">Release Date: {movie.release_date}</p>
                    <button
                      type="button" // Add this line to prevent form submission
                      onClick={(event) => toggleMovieStatus(event, movie.id, !movie.enabled)}
                      className={`btn ${movie.enabled ? 'btn-warning' : 'btn-success'}`}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : movie.enabled ? 'Disable' : 'Enable'}
                    </button>
                    {movie.enabled && (
                      <>
                        <Link to={`/admin/posts/${movie.id}/edit`} className="btn btn-primary ml-2">Edit</Link>
                        <button
                          onClick={(event) => handleDeleteClick(event, movie.id)}
                          className="btn btn-danger ml-2"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this movie?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirmDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default checkAuth(ListPosts);
