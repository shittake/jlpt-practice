import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { HTTP_ENDPOINT_PREFIX } from "../../Constants";

const bcrypt = require("bcryptjs");
const LoginPage = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleHashPassword = async () => {
    const saltRounds = 5;
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    axios
      .post(`${HTTP_ENDPOINT_PREFIX}/verify`, {
        email: email,
        password: password,
      })
      .then((response) => {
        const isLoggedIn = response?.data?.isVerified || false;
        setIsLoggedIn(isLoggedIn);
        if (!isLoggedIn)
          setErrorMessage("The email and password combination is incorrect");
        window.sessionStorage.setItem("isLoggedIn", isLoggedIn);
        setIsLoading(false);
      });
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row className="justify-content-md-center">
        <Col md="10">
          <h1 style={{ marginBottom: "10%" }}>JLPT practice portal</h1>
          <Card className="p-5 rounded-3 shadow-sm">
            <h1 className="text-center">Login to track your progress!</h1>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Control
                    className="form-control"
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group
                  style={{ marginTop: "10%", marginBottom: "10%" }}
                  controlId="formPassword"
                >
                  <Form.Control
                    className="form-control"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                {errorMessage && (
                  <p style={{ color: "red", marginBottom: "10%" }}>
                    {errorMessage}
                  </p>
                )}
                <Button type="submit" disabled={isLoading} variant="primary">
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
