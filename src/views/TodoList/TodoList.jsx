import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./TodoList.module.css";
import Modal from "../../components/Modal/Modal";

const TodoList = () => {
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [newData, setNewData] = useState(false);

  const [formData, setFormData] = useState({
    CategoryId: "",
    title: "",
    description: "",
    UserId: userId,
  });

  const [todoEdit, setTodoEdit] = useState(null);

  const [modalEliminar, setModalEliminar] = useState({
    isOpen: false,
    todo: [],
  });


  useEffect(() => {

      axios
        .get(`http://localhost:3001/todoApp/todo/${userId}`)
        .then((response) => {
          setData(response.data.data);

          
        })
        .catch((error) => console.error(error));

  }, [newData]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/todoApp/Category/`)
      .then((response) => {
        setDataCategory(response.data.data);
      })
       
      .catch((error) => console.error(error));
    //contador();
  }, []);
 
//Totales
let total = data?.length;
let completeCount = data?.filter((todo) => todo.isComplete === true).length;

  let pendingCount = data?.length - completeCount;

  if (dataFilter.length) {
      total = dataFilter.length;
      completeCount = dataFilter?.filter((todo) => todo.isComplete === true
               ).length;

      pendingCount = dataFilter?.length - completeCount;
  }

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

//*** */
  const handleSearch =async() => {

    setUserId(localStorage.getItem("userId"))

    if (formData.CategoryId) {
  
      const UserId = userId
      try {
        const response = (
        await axios.post(`http://localhost:3001/todoApp/todo/filter/${UserId}`, formData)
         ).data;

        if (response.data) {
          setDataFilter(response.data);
          setNewData(!newData);

      } else {
          if (response.error) return alert(response.error);
        } 
        
     } catch (error) {
       window.alert(error.message);
      } 
      
    } else {
      window.alert("Select a category");
  }
}
  const addTodo = (e) => {
    e.preventDefault();
    setDataFilter([]);

    if (todoEdit !== null) {

      //PUT ToDo - Function
      putTodo(formData, todoEdit);
      
      setTodoEdit(null);
      setFormData({ CategoryId: "", title: "", description: "", UserId: userId });
      
    } else {
        if (
             formData.title !== "" &&
             formData.description !== "" &&
             formData.CategoryId !== "" &&
             (formData.UserId !== null || formData.UserId !== "")
            ) {
          postTodo(formData);
          setFormData({ CategoryId: "", title: "", description: "", UserId: userId });
          
        } else {
          window.alert("Incomplete data");
        }   
    }
  };

  //FUNCTION - ADD NEW - POST
  const postTodo = async (formData) => {
    try {
      const response = (
        await axios.post("http://localhost:3001/todoApp/todo", formData)
      ).data;
      console.log("Rpta - add response")
        console.log(response);

      if (response.data) {
        
        setNewData(!newData);
      } else {
        if (response.error) return alert(response.error);
      }
    } catch (error) {
      window.alert(error.message);
    }
  };
  //FUNCTION - EDIT
  const putTodo = async (formData, id) => {
    
    try {
      const response = (
        await axios.put(`http://localhost:3001/todoApp/todo/${id}`, formData)
      ).data;
  

      if (response.data) {
       
        setNewData(!newData);
       
      } else {
        if (response.error) return alert(response.error);
      }
    } catch (error) {
      window.alert(error.message);
    }
  };
  //DELETE
  const deleteTodo = async (id) => {
    try {
        setDataFilter([]);

      if (id) {
        const newTodo = (
          await axios.delete(`http://localhost:3001/todoApp/todo/${id}`)
        ).data;
        console.log(newTodo);

        if (newTodo.data) {
          setNewData(!newData);
          setModalEliminar({ isOpen: false, todo: {} });

        } else {
          if (newTodo.error) return alert("response.data.error");
        }
      }
    } catch (error) {
      throw Error(error.message);
    }
  };
  const toggleTodo = (id) => {
    if (!dataFilter.length) {
      const newTodo = [...data];
      let todo = newTodo.find((todo) => todo.id === id);
      todo.isComplete = !todo.isComplete;

      //Function putTodo
      putTodo(todo, id);
    } else {
      const newTodo = [...dataFilter];
      let todo = newTodo.find((todo) => todo.id === id);
      todo.isComplete = !todo.isComplete;
      putTodo(todo, id);
    }
    
  };

  //Function Edit
  const editTodo = (id) => {
    const todo = data.find((todo) => todo.id === id);
    console.log(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      CategoryId: todo.CategoryId,
    });
    setTodoEdit(id);
  };
 
  return (
    <div className={styles.contenedorPrincipal}>
      <div className={styles.contenedorSelect}>
        <select
          name="CategoryId"
          id="Category"
          value={formData.CategoryId}
          onChange={handleChange}
        >
          {formData.CategoryId === "" && (
            <option value="">Select a category</option>
          )}
          {dataCategory?.map((elem) => {
            return (
              <option key={elem.id} value={elem.id}>
                {elem.id}
              </option>
            );
          })}
        </select>
        <button className={styles.buttonSearch} onClick={handleSearch}>
          Search
        </button>
      </div>

      <form onSubmit={addTodo}>
        <div className={styles.contenedorInput}>
          <select
            name="CategoryId"
            id="CategoryId"
            value={formData.CategoryId}
            onChange={handleChange}
          >
            {formData.CategoryId === "" && (
              <option value="">Select a category</option>
            )}
            {dataCategory?.map((elem) => {
              return (
                <option key={elem.id} value={elem.id}>
                  {elem.id}
                </option>
              );
            })}
          </select>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <input className={styles.inputSubmit} type="submit" value="Save ToDo" />
        </div>
      </form>

      <div className={styles.contenedorCaja}>
        <div className={styles.contenedorTodo}>
          <h5>ToDo List</h5>
          
        </div>

        {/*  Filter*/}
        {dataFilter?.length > 0
          ? dataFilter?.map((todo) => (
              <div key={todo.id} className={styles.conteinerItems}>
                <input
                  type="checkbox"
                  checked={todo.isComplete}
                  onChange={() => toggleTodo(todo.id)}
                />
                <p>
                  Category: {todo.CategoryId} -- Title: {todo.title}
                  <br />
                  <span
                    className={todo.isComplete ? `${styles.strikethrough}` : ""}
                  >
                    {todo.description}
                  </span>
                </p>

                <div className={styles.conteinerEdit}>
                  {todo.isComplete && <span>Complete</span>}
                  <button onClick={() => editTodo(todo.id)}>✏️</button>

                  <button
                    onClick={() =>
                      setModalEliminar({ isOpen: true, todo: todo })
                    }
                  >🗑️</button>
                </div>
              </div>
          ))
          //Data
          : data?.map((todo) => (
              <div key={todo.id} className={styles.conteinerItems}>
                <input
                  type="checkbox"
                  checked={todo.isComplete}
                  onChange={() => toggleTodo(todo.id)}
                />
                <p>
                  Category: {todo.CategoryId} -- Title: {todo.title}
                  <br />
                  <span
                    className={todo.isComplete ? `${styles.strikethrough}` : ""}
                  >
                    {todo.description}
                  </span>
                </p>

                <div className={styles.conteinerEdit}>
                  {todo.isComplete && <span>Complete</span>}
                  <button onClick={() => editTodo(todo.id)}>✏️</button>

                  <button
                    onClick={() =>
                      setModalEliminar({ isOpen: true, todo: todo })
                    }
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

        <div className={styles.containerTotal}>
          <span>
            ToDo Total: {total} , complete: {completeCount} , pendiente:
            {pendingCount}
          </span>
        </div>
      </div>
      <Modal
        isOpen={modalEliminar.isOpen}
        onClose={() => setModalEliminar({ isOpen: false, todo: {} })}
      >
        <div className={styles.containerModel}>
          <h4>Do you want to delete task? {modalEliminar.todo.title}</h4>
          <div className={styles.containerModelDiv}>
            <button
              className={styles.btnDanger}
              onClick={() => deleteTodo(modalEliminar.todo.id)}
            >
              Yes, yes delete task
            </button>
            <button
              className={styles.btnSuccess}
              onClick={() => setModalEliminar({ isOpen: false, todo: {} })}
            >
              No, do not delete task
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
