import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div>
      <nav>
        <Link to="/">TickY</Link>
        <input type="text" placeholder="Search..." />
        <Link to="/browse">Browse</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/Login">Login</Link>
      </nav>
    </div>
  );
};

export default Nav;
