import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";

function EditPost() {
    const { movieId } = useParams();
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState("");
    const [release_date, setReleaseDate] = useState("");
    const [poster, setPoster] = useState(null); // State for the poster image file
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isSuperuser = useSelector((state) => state.auth.isSuperuser);
    
    useEffect(() => {
        if (user && user.token) {
            axios.get(`http://127.0.0.1:8000/movieapi/event/${movieId}`, {
                headers: { 'Authorization': `Token ${user.token}` }
            })
            .then(response => {
                const { title, genre, description, release_date, poster  } = response.data;
                setTitle(title);
                setGenre(genre);
                setDescription(description);
                setReleaseDate(release_date);
                setPoster(poster);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
                // Handle error appropriately (e.g., display a message to the user)
            });
        }
    }, [movieId, user]);

    function updatePost() {
        if (user && user.token) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('genre', genre);
            formData.append('description', description);
            formData.append('release_date', release_date);
            formData.append('poster', poster); // Append the poster image file
    
            axios.put(`http://127.0.0.1:8000/movieapi/update_event/${movieId}`, formData, {
                headers: {
                    'Authorization': `Token ${user.token}`,
                    'Content-Type': 'multipart/form-data' // Specify content type as multipart form data
                }
            })
            .then(response => {
                alert(response.data.message);
                navigate('/admin/posts');
            })
            .catch(error => {
                console.error('Error updating post:', error);
                // Handle error appropriately (e.g., display a message to the user)
            });
        }
    }
    

    const handlePosterChange = (event) => {
        const file = event.target.files[0];
        setPoster(file);
    };

    return (
        <div style={{ backgroundColor: "#ADD8E6", minHeight: "100vh", padding: "20px 0" }}>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1 className="text-center">Edit Movie</h1>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(event) => { setTitle(event.target.value) }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Genre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={genre}
                                onChange={(event) => setGenre(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Release Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={release_date}
                                onChange={(event) => setReleaseDate(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Poster</label>
                            <input
                                type="file"
                                name="poster"
                                accept="image/*"
                                onChange={handlePosterChange}
                            />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary float-right" onClick={updatePost}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(EditPost);
