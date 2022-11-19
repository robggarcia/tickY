import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Users from "./components/Users";


//Push/pull Test - Brandon
function App() {
  const [users, setUsers] = useState([]);

  // i want to fetch the actual books and save them in state
  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    console.log(data);
    setUsers(data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <Link to="/users">Users</Link>
      <Routes>
        <Route path="/users" element={<Users users={users} />} />
      </Routes>
    </div>
  );
}

export default App;
