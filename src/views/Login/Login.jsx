import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import GoogleLogin from 'react-google-login';
import {gapi} from "gapi-script"


export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [access, setAccess] = useState(false);
  const [error, setError] = useState("");
  const [exit, setExit] = useState(false);

  const clientID =
    "860864085664-nvtrk53l5rbi2vqmk8f6j46ib48l73ck.apps.googleusercontent.com";
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (access || exit) {
      navigate('/')
    }
  }, [access, navigate, exit])
  
  useEffect(() => {
    const start = () => {
      gapi.auth2.init({
        clientId: clientID,
      })
    }
    gapi.load("client:auth2", start)
  }, [])

  const onSuccess = (response) => {
    // setUser(response.profileObj)
    const user = response.profileObj
    loginByGoogle(user)
    
  }

  const onFailure = () => {
    console.log("something went wrong")
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/todoApp/users/login",
        formData
      );

      if (!response.data.error) {
        window.alert("Successful login");
        setFormData({
          email: "",
          password: "",
        });

        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        localStorage.setItem("userId", response.data.data.id);
        localStorage.setItem("name", response.data.data.name);
        
        setAccess(true);

      } else {
        setAccess(false);
        window.alert("Invalid credentials");
      }
    } catch (error) {
  
      window.alert("Invalid credentials");
    }
  };

  //Login with Google
  const loginByGoogle = async(user) => {
    //e.preventDefault();
    try {
      if (user.email !== "") {
        const userData = {
          name: user.givenName,
          lastName: user.familyName,
          email: user.email,
          password: user.googleId,
        };
        //Si no está grabado el usuariod de google crearlo
        const response = await axios.post(
          "http://localhost:3001/todoApp/users/loginGoogle",
          userData
        );

        if (!response.data.error) {
          window.alert("Successful login");
          
          document.getElementById("email").value = "";
          document.getElementById("password").value = "";

          localStorage.setItem("userId", response.data.data.id);
          localStorage.setItem("name", response.data.data.name);

          setAccess(true);
        } else {
          setAccess(false);
          window.alert("Invalid credentials");
        }
      } else {
        setAccess(false);
        window.alert("Invalid credentials");
      }
      
    } catch (error) {
  
      window.alert("Invalid credentials");
    }
  }
  const handleExit = () => {
    setExit(true);
  };

  return (
    <div className="container w-50 bg-secondary">

      <div className="row w-80">

        <div className="col-12 d-flex justify-content-end">
          <button onClick={handleExit}>x</button>
        </div>

        <div className="col-12">
          <h2 className="fs-2 mb-5">Login</h2>
        </div>

        {/* GoogleLogin */}
        <div className="col-12">
          <GoogleLogin
            clientId={clientID}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy="single_host_policy"
          />
        </div>

        <div className="col">
          <form >
            <div className="row">
              <div className="col-6 col-md-12">
                <label className="form-label mt-5">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-6 col-md-12">
                <label className="form-label mt-5">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="password"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
                {error && <p className="text-danger">{error}</p>}
              </div>

              <div className="col-12 d-flex justify-content-end">
                <p className="mt-5">If you don't have an account</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <button onClick={handleSubmit} className="btn btn-success">
                  Sign In
                </button>
              </div>

              <div className="col-6">
                <Link to="/register" className={styles.createAccountLink}>
                  Register
                </Link>
              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
