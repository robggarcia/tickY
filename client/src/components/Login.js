import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ cart, setToken, token }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate("");

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log(username, password);
    const response = await fetch(`api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      setError(data.message);
    } else {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      if (cart.length > 0) {
        navigate("/cart");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="login">
      <div className="form">
        <p>Sign in to TickY</p>
        <p>{error}</p>
        <form onSubmit={handleLogin}>
          <div className="input-field">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="login-input"
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="login-input"
            />
          </div>
          <div className="input-field button">
            <input type="submit" value="Log In" />
          </div>
          <div className="login-signup">
            <Link to="/register">New to TickY? Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
