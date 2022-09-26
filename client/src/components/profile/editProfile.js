import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Navigate } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function EditProfile() {
  let userData = useLoaderData();
  const [user, setUser] = useState(userData);
  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    axios
      .put("/api/users/" + user._id, user)
      .then((resp) => {
        console.log(resp);
        toast.success("profile updated");
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };
  if (user && user._id) {
    return (
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" value={user.email} disabled />
            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="float-end">
            Save
          </Button>
        </Form>
      </Container>
    );
  } else {
    return <Navigate to="/login" />;
  }
}
