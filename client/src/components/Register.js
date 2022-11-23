import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("apikey", "NaWa96nugUm0Dzl2QvZ8VnleGWQBHm1o");

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: myHeaders,
    };

    const result = await fetch(
      `https://api.apilayer.com/email_verification/${email}`,
      requestOptions
    );

    const resultEmail = await result.json();
    console.log(resultEmail);

    if (resultEmail.message) {
      setError("invalid email format");
      return;
    } else {
      // add api for register
      const register = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });
      const data = await register.json();
      console.log(data);
      if (data.error) {
        setError(data.error);
      } else {
        props.setToken(data.token);
        navigate("/");
      }
      setError(error);
    }
  };

  return (
    <div className="register">
      <div className="form">
        <Link to="/" className="title">
          TickY
        </Link>
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
