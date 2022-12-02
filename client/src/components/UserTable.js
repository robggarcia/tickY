import { useState } from "react";
import { updateUser } from "../api";

const UserTable = ({ token, user, idx }) => {
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [admin, setAdmin] = useState(user.admin);

  const editUser = () => {
    setEdit(!edit);
  };

  const submitUser = async () => {
    const updatedUser = await updateUser({
      token,
      userId: user.id,
      username,
      email,
    });
    console.log("USER UPDATED: ", updatedUser);
    setEdit(!edit);
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (event) => setEmail(event.target.value);

  const updateAdmin = () => setAdmin(!admin);

  return (
    <tbody key={idx}>
      <tr>
        <td>
          <input type="text" value={username} onChange={updateUsername} />
        </td>
        <td>
          <input type="text" value={email} onChange={updateEmail} />
        </td>
        <td>
          <input type="checkbox" value={admin} onChange={updateAdmin} />
        </td>
        <td>
          <button id={user.id} onClick={submitUser}>
            Edit
          </button>
        </td>
      </tr>
    </tbody>
  );
};

export default UserTable;
