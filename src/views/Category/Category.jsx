import { useState } from "react";
import axios from "axios";
import { Link} from "react-router-dom";
import styles from "./Category.module.css";

export default function Category() {
  const [formData, setFormData] = useState({
    id: "",
  });
  const [errors, setErrors] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.id === "") {
      setErrors("This field is required");

    } else {
      //Post Category
      try {
       const response = await axios.post(
      "http://localhost:3001/todoApp/category/",
      formData
       );

      console.log("Rpta Post Category");
      console.log(response.data);
      if (!response.data.error) {
         window.alert("Created Category!");
          setFormData({
            category: "",
         });
        document.getElementById("id").value = "";
      } else {
        window.alert(response.data.error)
      }
     } catch (error) {
        window.alert(error.message);
      }
    }
    
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h2 className={styles.loginTitle}>Create Category</h2>
        <form>
          <div className={styles.inputContainer}>
            <div>
              <input
                type="id"
                name="id"
                id="id"
                autoComplete="id"
                placeholder="category"
                className={styles.input}
                onChange={handleChange}
                required
              />
            </div>
            
          </div>
          {errors && (
            <p className={styles.error}>{errors}</p>
          )}

          <div className={styles.buttonContainer}>
            <button onClick={handleSubmit} className={styles.button}>
              Save
            </button>
            <div className={styles.createAccount}>
              <Link to="/" className={styles.createAccountLink}>
                Exit
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
