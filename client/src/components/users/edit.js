import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-hot-toast";

export default function Edit() {
  const [user, setUser] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`/api/users/${id}`);
      const resp = await response.json();
      if (resp.message) {
        toast.error(resp.message);
        navigate("/users");
        return;
      } else {
        resp.roles = resp.roles.join();
        setUser(resp);
      }
    }

    fetchData();
  }, [params.id, navigate]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    let editedPerson = {
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    };
    if (typeof editedPerson.roles == "string" && editedPerson.roles.includes(",")) {
      editedPerson.roles = editedPerson.roles.split(",");
    }
    let updated = await fetch(`/api/users/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(editedPerson),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      toast.error(error);
      return;
    });
    if (updated && !updated.message) {
      toast.success("User updated");
      navigate("/users/");
    } else {
      toast.error(updated.message);
    }
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" value={user.email || ""} disabled />
          <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            name="firstName"
            value={user.firstName || ""}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            name="lastName"
            value={user.lastName || ""}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formRoles">
          <Form.Label>Roles</Form.Label>
          <Form.Control
            type="text"
            placeholder="Roles"
            name="roles"
            value={user.roles || ["user"]}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="float-end">
          Save
        </Button>
      </Form>
    </Container>
  );
}
