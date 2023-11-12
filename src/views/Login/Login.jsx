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

  const [userGoogle, setUserGoogle] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [access, setAccess] = useState(false);
  const [error, setError] = useState("");
  const [exit, setExit] = useState(false);
  const [user, setUser] = useState({})

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
    //setUser(response.profileObj)
    //console.log("Google-Login")
    //console.log(response)
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
      setUserGoogle({
        name: user.name,
        lastName: user.familyName,
        email: user.email,
        password: "12345",
      });

      //Si no está grabado el usuariod de google crearlo
      //FALTA MODIFICAR O CREAR UN CONTROLLER MÁS
      const response = await axios.post(
        "http://localhost:3001/todoApp/users",
        userGoogle
      );

      if (!response.data.error) {
        window.alert("Successful login");
        setUserGoogle({
          name: "",
          lastName: "",
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
  }
  const handleExit = () => {
    setExit(true);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.exitContainer}>
          <button onClick={handleExit}>x</button>
        </div>
        <h2 className={styles.loginTitle}>Login</h2>
        {/* GoogleLogin */}
        <div>
          <GoogleLogin
            clientId={clientID}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy='single_host_policy'
          />
        </div>

        <form>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              className={styles.input}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="password"
              className={styles.input}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.parrafo}>
            <p>If you don't have an account</p>
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={handleSubmit} className={styles.button}>
              Enter
            </button>
            <div className={styles.createAccount}>
              <Link to="/register" className={styles.createAccountLink}>
                create Account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
