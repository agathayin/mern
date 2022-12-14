import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./style.scss";
import toast from "react-hot-toast";
import axios from "axios";
import _ from "lodash";

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
  const { switchSignUp, refreshnavbar, ...rest } = props;

  const signUpUser = async (user) => {
    user.provider = "local";
    try {
      let resp = await axios.post("/api/auth/signup", user);
      console.log(resp);
      toast.success("New account created. Please sign in.");
      switchSignUp(false);
    } catch (err) {
      console.log(err);
      toast.error(_.get(err, "response.data.message") || "Failed to sign up");
    }
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
      user.email = user.email.toLowerCase();
      const emailRE =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; // eslint-disable-line
      if (user.email.match(emailRE)) {
        signUpUser(user);
      } else {
        return toast.error("Incorrect email format");
      }
    } else {
      return toast.error("Please fill in all fields");
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Modal {...rest} size="lg" aria-labelledby="signin-modal" centered>
      <Modal.Header closeButton={!props.hideClose}>
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
                    value={user.email || ""}
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
                <InputGroup noValidate>
                  <Form.Control
                    type="text"
                    id="SignUpFirstName"
                    value={user.firstName || ""}
                    name="firstName"
                    onChange={handleChange}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>Last Name</Col>
              <Col md={8}>
                <InputGroup noValidate>
                  <Form.Control
                    type="text"
                    id="SignUpLastName"
                    value={user.lastName || ""}
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
                    value={user.password || ""}
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
                    value={user.confirmPassword || ""}
                    name="confirmPassword"
                    onChange={handleChange}
                    isInvalid={user.confirmPassword && user.confirmPassword !== user.password}
                  />
                  <Form.Control.Feedback type="invalid">Password is inconsistent.</Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
          </Container>
          {switchSignUp && (
            <div className="text-center mt-3 fw-light fs-small">
              Already have an account
              <span
                className="text-primary"
                onClick={() => {
                  switchSignUp(false);
                }}
              >
                {" "}
                Sign In
              </span>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {!props.hideClose ? (
          <Button onClick={props.onHide} variant="danger">
            Close
          </Button>
        ) : (
          <Button
            onClick={() => {
              window.location.replace("/");
            }}
            variant="light"
          >
            Homepage
          </Button>
        )}
        <Button onClick={handleSubmit} variant="success">
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
