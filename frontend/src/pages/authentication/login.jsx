import React, { useState, useEffect } from "react";
import "../../styles/sudul/Login.css";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { gapi } from "gapi-script";

import loginImage from "../../assets/images/login-vector.webp";
import GoogleLoginButton from "../../components/GoogleLoginButton";

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
  });

  async function login(values) {
    setIsLoading(true);
    const loginData = { email: values.email, password: values.password };

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, loginData);

      if (res.data.status) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Login Successfully!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        sessionStorage.setItem("userid", res.data.id);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please Check Your Email & Password!!",
          footer: "Your Credentials Are Invalid!!",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error Occurred While Login!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h2>PriceQ Login</h2>
      <Row>
        <Image src={loginImage} style={{ width: "300px" }} rounded />
      </Row>
      <Row>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={(values) => {
            login(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="form-group col-md-6">
                <label>Email</label>
                <Field
                  name="email"
                  placeholder="example@abc.com"
                  type="text"
                  className={
                    "form-control" +
                    (errors.email && touched.email ? " is-invalid" : "")
                  }
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="form-group col-md-6">
                <label>Password</label>
                <Field
                  name="password"
                  placeholder="Password"
                  type="password"
                  className={
                    "form-control" +
                    (errors.password && touched.password ? " is-invalid" : "")
                  }
                />
                <div className="invalid-feedback">{errors.password}</div>
              </div>

              <br />
              {isLoading ? (
                <Button variant="primary" disabled>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </Button>
              ) : (
                <Button variant="primary" type="submit" style={{ marginLeft: "110px" }}>
                  Login
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </Row>
      <Row className="mt-4">
        <GoogleLoginButton />
      </Row>

      <br />
      <div>
        New User? <a href="./register">Register</a>
      </div>
    </div>
  );
}

export default Login;