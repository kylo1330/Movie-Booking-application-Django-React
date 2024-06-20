import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const attemptLogin = () => {
    setIsLoading(true);
    axios
      .post("http://127.0.0.1:8000/movieapi/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        setIsLoading(false);
        setErrorMessage("");
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        const user = { username: username, token: token };
        const isSuperuser = response.data.is_superuser;
        dispatch(setUser({ user: user, isSuperuser: isSuperuser }));
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response && error.response.data) {
          if (error.response.data.errors) {
            setErrorMessage(Object.values(error.response.data.errors).join(""));
          } else if (error.response.data.message) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage("Failed to login user. Please contact admin");
          }
        } else {
          setErrorMessage("Network error occurred. Please try again later.");
        }
      });
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div className="row p-4 col-md-8 rounded bg-light">
        <div className="col-md-12 ">
          <h1 className="text-center mb-4" style={{ fontSize: "35px" }}>
            Login
          </h1>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="form-group">
            <Link to={"/register"} className="float-left">
              Create an account
            </Link>
            <button
              className="btn btn-primary float-right"
              onClick={attemptLogin}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;