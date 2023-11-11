
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
   // console.log("UserID del Local Storage")
    //console.log(id)
    //console.log(name)
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
      {/* <div className={styles.containerNav}>
      
      </div> */}
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          {/* {styles.containerButton} */}
          <div className="container">
            <div className="align-items-center">
              {!user ? (
                <NavLink to="/login">
                  <button className="btn btn-primary">Login</button>
                </NavLink>
              ) : (
                // Mostrar el nombre del usuario
                <div>
                  <div className={styles.userProfile}>
                    <span>{userName}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-danger">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            <div>
              <NavLink to="/category">
                <button className="btn btn-primary">Create Category</button>
              </NavLink>
            </div>
          </div>
        </nav>
      </header>
      {/* Titulo */}
      <div className="row py-3">
        <div className="col">
          <div className="border-bottom">
            <h2>ToDo Application</h2>
          </div>
        </div>
      </div>

      <section>
        <TodoList />
      </section>
      <footer>{}</footer>
    </div>
  );
}

export default Home;
