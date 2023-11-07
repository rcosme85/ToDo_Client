
import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from "./views/Home/Home";
import Category from "./views/Category/Category";
//import NadBar from "./components/NadBar/NadBar";
import Login from "./views/Login/Login";
import Register from './views/Login/Register';

function App() {

  //const location = useLocation();
  return (
    <div>
      {/* {location.pathname !== "/" ? <NadBar /> : null} */}
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App
