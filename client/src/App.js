import { Route, Routes } from "react-router-dom";
import "./App.css";
import {
  Artists,
  Browse,
  Cart,
  Home,
  Login,
  Register,
  Venues,
} from "./components";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
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
