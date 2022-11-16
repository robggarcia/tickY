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
    <div className="login">
      <div className="forms">
        <div className="form login">
          <Link to="/" className="title">
            TickY
          </Link>
          <p>Sign in to TickY</p>
          <p>{error}</p>
          <form onSubmit={handleLogin}>
            <div className="input-field">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
              <input type="button" value="Login In" />
            </div>
            <div className="login-signup">
              <Link to="/register">New to TickY? Create Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
