import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import _ from "lodash";
import toast from "react-hot-toast";
import "./style.scss";
import { useAuth } from "../../context/authContext";

export default function SignIn(props) {
  const { refreshnavbar, hideClose, switchSignUp, ...rest } = props;
  const [passwordShown, setPasswordShown] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const auth = useAuth();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const signInUser = async () => {
    console.log(user);
    if (user.email && user.password) {
      user.usernameOrEmail = user.email;
      try {
        let resp = await axios.post(`/api/auth/signin`, user, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (resp.status === 200) {
          setUser({
            email: "",
            password: "",
          });
          props.onHide();
          props.refreshnavbar();
          auth.signin(resp.data, () => {
            toast.success("sign in success");
          });
        } else {
          console.log(resp);
          toast.success("Something wrong with signing in");
        }
      } catch (errResp) {
        console.log(errResp);
        if (_.get(errResp, "response.status") === 422 && _.get(errResp, "response.data.message")) {
          toast.error(_.get(errResp, "response.data.message"));
        } else {
          toast.error(_.get(errResp, "response.statusText") || "Failed to sign in");
        }
      }
    }
  };
  return (
    <Modal {...rest} size="md" aria-labelledby="signin-modal" centered>
      <Modal.Header closeButton={!props.hideClose}>
        <Modal.Title id="contained-modal-title-vcenter">Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="mb-3">
            <Col md={4}>Email:</Col>
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
        {switchSignUp && (
          <div className="text-center mt-3 fw-light fs-small">
            Create a new account
            <span
              className="text-primary"
              onClick={() => {
                switchSignUp(true);
              }}
            >
              {" "}
              Sign Up
            </span>
          </div>
        )}
        <div className="text-center fw-light fs-small">
          <a className="text-warning text-decoration-none" href="/resetPsw">
            Forget password
          </a>
        </div>
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
        <Button onClick={signInUser} variant="success">
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
