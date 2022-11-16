import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(error);
  };
  return (
    <div className="register">
      <div className="form">
        <Link to="/">TickY</Link>
        <p>Create account</p>
        <p>{error}</p>
        <form onSubmit={handleRegister}>
          <div className="input-field">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="register-input"
            />
          </div>
          <div className="input-field">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="register-input"
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="register-input"
            />
          </div>
          <div className="input-field button">
            <button>Create account</button>
          </div>
          <Link to="/login">Have a TickY account? Sign in</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
