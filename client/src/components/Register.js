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
    <div>
      <Link to="/">TickY</Link>
      <p>Create account</p>
      <p>{error}</p>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
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
        <button>Create account</button>
      </form>
      <Link to="/login">Have a TickY account? Sign in</Link>
    </div>
  );
};

export default Register;
