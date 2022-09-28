import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import _ from "lodash";
import axios from "axios";
import Container from "react-bootstrap/Container";

const User = (props) => (
  <tr>
    <td>{props.user._id}</td>
    <td>
      {props.user.firstName} {props.user.lastName}
    </td>
    <td>{props.user.email}</td>
    <td>
      <Link className="btn btn-link" to={`/users/edit/${props.user._id}`}>
        Edit
      </Link>{" "}
      |
      <button
        className="btn btn-link"
        onClick={() => {
          props.deleteUser(props.user._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

export default function UserList() {
  const [users, setUsers] = useState([]);

  // This method fetches the users from the database.
  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get(`/api/users/`);
        console.log(response);
        setUsers(response.data);
      } catch (err) {
        console.log(err);
        toast.error(_.get(err, "response.data.message") || "an error occurred");
      }
    }
    getUsers();
    return;
  }, []);

  async function deleteUser(id) {
    if (window.confirm("Do you confirm to delete this user?")) {
      await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const newUsers = users.filter((el) => el._id !== id);
      setUsers(newUsers);
    }
  }

  function userList() {
    return users.map((user) => {
      return <User user={user} deleteUser={() => deleteUser(user._id)} key={user._id} />;
    });
  }

  return (
    <Container>
      <h3>User List </h3>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{userList()}</tbody>
      </table>
    </Container>
  );
}
