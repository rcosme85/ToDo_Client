import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Ajusta la importación según tu enrutador
import styles from './Login.module.css';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [access, setAccess] = useState(false);
  const [error, setError] = useState("");
  const [exit, setExit] = useState(false);

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
  }, [access, navigate,exit])
  
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
