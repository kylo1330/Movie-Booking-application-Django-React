import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";

function CreatePost() {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [description, setDescription] = useState('');
    const [release_date, setRelease_date] = useState('');
    const [poster, setPoster] = useState(null); // State for the poster image file
  
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const isSuperuser = useSelector((state) => state.auth.isSuperuser);
    
    const addMovie = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("genre", genre);
        formData.append("description", description);
        formData.append("release_date", release_date);
        formData.append("poster", poster); // Append the poster image file to the form data
    
        axios.post("http://127.0.0.1:8000/movieapi/create_event", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Token ${user.token}`,
            },
        }).then(response => {
            navigate('/admin/posts');
        }).catch(error => {
            console.error('Error adding new movie:', error);
        });
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        addMovie();
    };

    const handlePosterChange = (event) => {
        // Get the selected file from the input field
        const file = event.target.files[0];
        // Update the state with the selected file
        setPoster(file);
    };

    return (
        <div style={{ backgroundColor: "#ADD8E6", minHeight: "100vh", padding: "20px 0" }}>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1 className="text-center">Add Movie</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={title} 
                                    onChange={(event) => setTitle(event.target.value)}
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
                                    onChange={(event) => setRelease_date(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
              <label>Poster:</label>
              <input
                type="file"
                name="poster"
                accept="image/*"
                onChange={(e) => setPoster(e.target.files[0])}
              />
            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(CreatePost);
