import { Route, Routes } from "react-router-dom";
import "./App.css";
import {
  Artists,
  Cart,
  Concerts,
  Home,
  Login,
  Nav,
  Register,
  Venues,
} from "./components";

function App() {
  return (
    <div className="App">
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/concerts" element={<Concerts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/artists" element={<Artists />} />
      </Routes>
    </div>
  );
}

export default App;
