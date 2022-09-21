import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import "./style.scss";

export default function SignIn(props) {
  const [passwordShown, setPasswordShown] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const signInUser = async () => {
    console.log(user);
    if (user.email && user.password) {
      user.usernameOrEmail = user.email;
      let resp = await axios.post(`/api/auth/signin`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(resp);
      if (resp.status === 200) {
        setUser({
          email: "",
          password: "",
        });
        props.onHide();
        props.refreshnavbar();
      } else {
        alert(resp.statusText);
      }
    }
  };
  return (
    <Modal {...props} size="lg" aria-labelledby="signin-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="mb-3">
            <Col md={4}>Email / Username:</Col>
            <Col md={8}>
              <InputGroup hasValidation>
                <Form.Control type="text" required value={user.email} name="email" onChange={handleChange} />
                <Form.Control.Feedback type="invalid">Please fill in username or email.</Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>Password:</Col>
            <Col md={8}>
              <InputGroup>
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
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="danger">
          Close
        </Button>
        <Button onClick={signInUser} variant="success">
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
