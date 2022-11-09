import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(error);
  };
  return (
    <div>
      <Link to="/">TickY</Link>
      <p>Sign in to TickY</p>
      <p>{error}</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button>Sign In</button>
      </form>
      <Link to="/register">New to TickY? Create Account</Link>
    </div>
  );
};

export default Login;
