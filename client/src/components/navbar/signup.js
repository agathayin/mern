import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./style.scss";

export default function SignUp(props) {
  const [passwordShown, setPasswordShown] = useState(false);
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const signUpUser = async (user) => {
    user.provider = "local";
    let resp = await fetch(`/api/auth/signup`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    resp = await resp.json();
    console.log(resp);
    setUser({});
    props.onHide();
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    console.log(form);
    console.log(user);
    if (user.email && user.password && user.password === user.confirmPassword) {
      signUpUser(user);
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Modal {...props} size="lg" aria-labelledby="signin-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Container>
            <Row className="mb-3">
              <Col md={4}>Email</Col>
              <Col md={8}>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    required
                    id="SignUpEmail"
                    value={user.email}
                    name="email"
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">Please fill in email.</Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>First Name</Col>
              <Col md={8}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    id="SignUpFirstName"
                    value={user.firstName}
                    name="firstName"
                    onChange={handleChange}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>Last Name</Col>
              <Col md={8}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    id="SignUpLastName"
                    value={user.lastName}
                    name="lastName"
                    onChange={handleChange}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>Password:</Col>
              <Col md={8}>
                <InputGroup noValidate>
                  <Form.Control
                    placeholder="Password"
                    aria-label="password"
                    aria-describedby="signin-password"
                    as="input"
                    type={passwordShown ? "text" : "password"}
                    value={user.password}
                    name="password"
                    onChange={handleChange}
                  />
                  <Button variant="secondary" onClick={() => setPasswordShown(!passwordShown)}>
                    {passwordShown ? <i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}
                  </Button>
                </InputGroup>
                {<div className="text-danger"></div>}
              </Col>
            </Row>
            <Row>
              <Col md={4}>Confirm Password:</Col>
              <Col md={8}>
                <InputGroup noValidate>
                  <Form.Control
                    placeholder="Password"
                    aria-label="password"
                    aria-describedby="signin-password"
                    as="input"
                    type="password"
                    value={user.confirmPassword}
                    name="confirmPassword"
                    onChange={handleChange}
                    isInvalid={user.confirmPassword && user.confirmPassword !== user.password}
                  />
                  <Form.Control.Feedback type="invalid">Password is inconsistent.</Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="danger">
          Close
        </Button>
        <Button onClick={handleSubmit} variant="success">
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
