import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import _ from "lodash";
import { useAuth } from "../../context/authContext";

export default function ResetPsw() {
  const auth = useAuth();
  let userData = useLoaderData();
  const [user, setUser] = useState(userData);
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();
  const [counter, setCounter] = React.useState(0);
  React.useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);
  if (!user.email) {
    let params = new URLSearchParams(window.location.search);
    let queryEmail = params.get("email");
    if (queryEmail) {
      user.email = queryEmail;
      setUser(user);
    }
  }
  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const forgetEmail = () => {
    if (!user.email) {
      return toast.error("Please fill in email");
    }
    setCounter(60);
    axios
      .post("/api/auth/forgetPsw", { email: user.email })
      .then((resp) => {
        console.log(resp);
        if (resp.status === 204) {
          return toast.success("Email sent");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const resetPassword = () => {
    if (!user.email) {
      return toast.error("Please fill in email");
    }
    if (user.newPassword !== user.confirmPassword) {
      return toast.error("Password is inconsistent");
    }
    if (!user.password && !user.resetPasswordToken) {
      return toast.error("Please fill in password or code");
    }
    let body = !user._id
      ? {
          email: user.email,
          resetPasswordToken: user.resetPasswordToken,
          newPassword: user.newPassword,
        }
      : {
          email: user.email,
          password: user.password,
          newPassword: user.newPassword,
        };
    axios
      .post("/api/auth/resetPsw", body)
      .then((resp) => {
        console.log(resp);
        if (resp.status === 200) {
          toast.success("Password reset done. Redirect to login page.");
          axios.post("/api/auth/logout", { withCredentials: true }).then((resp) =>
            auth.signout(() => {
              window.location.replace("/login");
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(_.get(err, "response.data.message") || "Failed to reset password");
      });
  };
  if (user && user._id) {
    return (
      <Container>
        <div className="fs-3 mb-3">Reset Password</div>
        <Form>
          <Row>
            <Col sm={3}>Email</Col>
            <Col sm={9}>
              <Form.Control type="text" required id="SignUpEmail" value={user.email || ""} name="email" disabled />
            </Col>
          </Row>
          <hr />
          <Row className="mt-3 mb-3">
            <Col sm={3}>Current Password</Col>
            <Col sm={9}>
              <Form.Control
                type="password"
                required
                id="code"
                value={user.password || ""}
                name="password"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={3}>New Password</Col>
            <Col md={9}>
              <InputGroup noValidate>
                <Form.Control
                  placeholder="Password"
                  aria-label="password"
                  aria-describedby="signin-password"
                  as="input"
                  type={passwordShown ? "text" : "password"}
                  value={user.newPassword || ""}
                  name="newPassword"
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
            <Col md={3}>Confirm Password</Col>
            <Col md={9}>
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
                  isInvalid={user.confirmPassword && user.confirmPassword !== user.newPassword}
                />
                <Form.Control.Feedback type="invalid">Password is inconsistent.</Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Row>
          <Button className="float-end mt-3" onClick={resetPassword}>
            Save
          </Button>
        </Form>
      </Container>
    );
  } else {
    return (
      <Container>
        <div className="fs-3 mb-3">Forget Password</div>
        <Form>
          <Row>
            <Col sm={3}>Email</Col>
            <Col sm={7}>
              <Form.Control
                type="text"
                required
                id="SignUpEmail"
                value={user.email || ""}
                name="email"
                onChange={handleChange}
              />
            </Col>
            <Col sm={2}>
              <Button disabled={counter > 0} onClick={forgetEmail} className="w-100">
                Send Email
              </Button>
            </Col>
          </Row>
          {counter > 0 && <div>Please wait {counter} seconds if you need another email</div>}
          <hr />
          <Row className="mt-3 mb-3">
            <Col sm={3}>Code</Col>
            <Col sm={9}>
              <Form.Control
                type="text"
                required
                id="code"
                value={user.resetPasswordToken || ""}
                name="resetPasswordToken"
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={3}>New Password</Col>
            <Col md={9}>
              <InputGroup noValidate>
                <Form.Control
                  placeholder="Password"
                  aria-label="password"
                  aria-describedby="signin-password"
                  as="input"
                  type={passwordShown ? "text" : "password"}
                  value={user.newPassword || ""}
                  name="newPassword"
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
            <Col md={3}>Confirm Password</Col>
            <Col md={9}>
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
                  isInvalid={user.confirmPassword && user.confirmPassword !== user.newPassword}
                />
                <Form.Control.Feedback type="invalid">Password is inconsistent.</Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Row>
          <Button className="float-end mt-3" onClick={resetPassword}>
            Save
          </Button>
        </Form>
      </Container>
    );
  }
}
