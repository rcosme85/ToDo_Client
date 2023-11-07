
import { NavLink } from "react-router-dom";
import TodoList from "../TodoList/TodoList";
import styles from "./Home.module.css"
import { useState, useEffect } from "react";

function Home() {

  const [user, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  
  useEffect(() => {
    
    // const storedUser = JSON.parse(localStorage.getItem("userId"));
    const id = localStorage.getItem("userId");
    const name = localStorage.getItem("name")
    console.log("UserID del Local Storage")
    console.log(id)
    console.log(name)
      if (id) {
        setUserId(id);
        setUserName(name)
      } 
  }, []);

  const handleLogout = () => {
    // Limpiar la información del local storage
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    setUserId(null);
    setUserName(null)
    window.location.reload();
  };

  return (
    <div>
      <div className={styles.containerNav}>
        <nav>
          
          <div className={styles.containerButton}>
            <div>
              {!user ? (
                <NavLink to="/login">
                  <button className={styles.button}>Login</button>
                </NavLink>
              ) : (
                // Mostrar el nombre del usuario 
                <div>
                  <div className={styles.userProfile}>
                    <span>{userName}</span>
                  </div>
                  <button onClick={handleLogout} className={styles.button}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          
          </div>
        </nav>
      </div>
      <section className={styles.containerCategory}>
        <div>
          <NavLink to="/category">
            <button className={`${styles.button}`}>Create Category</button>
          </NavLink>
        </div>
      </section>
      <section className={styles.containerToDo}>
        <h2>ToDo Application</h2>
      </section>
      <section>
        <TodoList />
      </section>
      <footer>{}</footer>
    </div>
  );
}

export default Home;
