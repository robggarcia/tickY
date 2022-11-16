import { Link } from "react-router-dom";
import "./Nav.css";

const Nav = () => {
  return (
    <div className="navbar">
      <Link to="/">TickY</Link>
      <input id="nav-search" type="text" placeholder="Search..." />
      <div className="links">
        <Link to="/concerts">Concerts</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/Login">Login</Link>
      </div>
    </div>
  );
};

export default Nav;
