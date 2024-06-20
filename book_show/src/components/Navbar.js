import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";

function Navbar() {
    const user = useSelector(store => store.auth.user);
    const isSuperuser = useSelector(store => store.auth.isSuperuser); // New: Get isSuperuser from state
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        description: "",
        image_url: "",
        ticket_price: 0,
        show_date: "",
        end_date: "",
        show_time: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://example.com/api/events', formData, {
            headers: { 'Authorization': "Bearer " + user.token }
        })
        .then(response => {
            navigate('/events'); // Assuming '/events' is the route for displaying events
        })
        .catch(error => {
            console.error('Error creating event:', error);
        });
    };

    function logout() {
        if (user) {
            axios.post('http://127.0.0.1:8000/movieapi/logout', {}, {
                headers: { 'Authorization': "Token " + user.token }
            })
            .then(() => {
                dispatch(removeUser());
                navigate('/login');
            })
            .catch(error => {
                console.error("Logout failed:", error);
                // Handle logout failure, if necessary
            });
        }
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="navbar-brand">
                <h4 style={{ paddingLeft: '10px' }}>
                    <span style={{ color: '#E6DDF3' }}>KYLO</span>
                    <span style={{ color: '#A52A2A' }}>MOVIES</span>
                </h4>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse mr-auto" id="navbarNav" style={{ float: "left" }}>
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                    <li className="nav-item">
                        <NavLink exact to={"/"} className="nav-link" activeClassName="active">
                            Home
                        </NavLink>
                    </li>
                    {user ? (
                        <React.Fragment>
                            {isSuperuser && ( // Render the "Movies" link only if user is an admin
                                <li className="nav-item">
                                    <NavLink to={"/admin/posts"} className="nav-link" activeClassName="active">
                                        Movies
                                    </NavLink>
                                </li>
                            )}
                            <li className="nav-item">
                                <span className="nav-link" onClick={logout}>Logout</span>
                            </li>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <li className="nav-item">
                                <NavLink to={"/register"} className="nav-link" activeClassName="active">
                                    Signup
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/login"} className="nav-link" activeClassName="active">
                                    Login
                                </NavLink>
                            </li>
                        </React.Fragment>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
