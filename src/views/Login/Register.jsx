import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import styles from "./Register.module.css";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
   const [exit, setExit] = useState(false);
   const [access, setAccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar campos obligatorios
    const newErrors = {};
    if (formData.name === "") {
      newErrors.name = "This field is required";
    }
    if (formData.lastName === "") {
      newErrors.lastName = "This field is required";
    }
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = emailPattern.test(formData.email)
    if (!validEmail) {
      document.getElementById("email").value = "";
       newErrors.email = "Email invalid";
    }
  
    if (formData.email === "") {
      newErrors.email = "This field is required";
    }
    if (formData.password === "") {
      newErrors.password = "This field is required";
    }
    if (formData.confirmPassword === "") {
      newErrors.confirmPassword = "This field is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log("FormData de Registro User")
      console.log(formData)

      const response = await axios.post(
        "http://localhost:3001/todoApp/users/",
        formData
      );
      console.log("Rpta Post User")
      console.log(response.data);
      if (response.data) {
        window.alert("Created user!");
        setFormData({
          name: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          // admin: false,
        });

        document.getElementById("name").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";

        setAccess(true);
      } else {
        setAccess(false)
      }

    } catch (error) {
    
      window.alert(error.message);
    
    }
  }
 

  useEffect(() => {
    if (access || exit) {
      navigate("/login");
    }
  }, [access, navigate, exit]);

  const handleExit = () => {
    setExit(true);
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <div className={styles.exitContainer}>
          <button onClick={handleExit}>x</button>
        </div>
        <h2 className={styles.loginTitle}>Create Account</h2>
        <form className ={styles.form}>
          <div className={styles.inputContainer}>
            <div>
              <input
                type="name"
                name="name"
                id="name"
                autoComplete="name"
                placeholder="name"
                className={styles.input}
                onChange={handleChange}
                required
              />
            </div>
            <div>

              <input
                type="lastName"
                name="lastName"
                id="lastName"
                autoComplete="lastName"
                placeholder="lastName"
                onChange={handleChange}
                required
              />
            </div>
            <div>

              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                placeholder="email"
                onChange={handleChange}
                required
              />
            </div>

            <div>
  
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="password"
                placeholder="password"
                onChange={handleChange}
                required
              />
            </div>
            <div>
  
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="confirm password"
                placeholder="confirm pasword"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}

          <div className={styles.buttonContainer}>
            <button onClick={handleSubmit} className={styles.button}>
              Save
            </button>
            <div className={styles.createAccount}>
              <Link to="/login" className={styles.createAccountLink}>
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
