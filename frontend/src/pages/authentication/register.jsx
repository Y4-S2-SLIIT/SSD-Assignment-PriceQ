import "../../styles/sudul/Register.css";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

function Register() {
  const [image, setImage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  //user register validation
  const registerSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "Too Short! Enter More Than 3 Characters")
      .max(50, "Too Long!")
      .required("Required"),
    lastName: Yup.string()
      .min(3, "Too Short! Enter More Than 5 Characters")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    contactNo: Yup.string()
      .min(10, "Enter valid mobile Number!")
      .max(12, "Too Long!")
      .required("Required"),
    password: Yup.string()
      .min(4, "Too Short! Enter More Than 8 Characters")
      .max(50, "Too Long!")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  async function register(values) {
    //add img to firebase
    const storageRef = ref(storage, `user/${Image.name + v4()}`);

    await uploadBytes(storageRef, image)
      .then(() => {
        console.log("uploaded");
      })
      .catch((err) => {
        console.log(err);
      });

    await getDownloadURL(storageRef).then(async (url) => {
      console.log(url);
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email.toLowerCase(),
        contactNo: values.contactNo,
        password: values.password,
        image: url,
        isoAuth: false,
      };
      await axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/user/`, data)
        .then((res) => {
          console.log(res);
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: "New User Registered Successfully!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            const login = {
              email: res.data.email,
              password: res.data.password,
            };
            axios
              .post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, login)
              .then((res) => {
                sessionStorage.setItem("userid", res.data.id);
                window.location.href = "/dashboard";
              })
              .catch((err) => {
                console.log(err);
              });
          }).catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please Check Your Email and Contact No!!",
            footer: "Your Email or Contact Number already exist!!",
          });
        });
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
      <div className="register-container">
        <h2>PriceQ Register</h2>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            contactNo: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={registerSchema}
          onSubmit={(values) => {
            setIsSubmitted(true);
            register(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              {/* firstName */}
              <div className="form-group col-md-6">
                <label>First Name</label>
                <Field
                  name="firstName"
                  placeholder="First Name"
                  type="text"
                  className={
                    "form-control" +
                    (errors.firstName && touched.firstName ? " is-invalid" : "")
                  }
                />
                <div className="invalid-feedback">{errors.firstName}</div>
              </div>

              {/* lastName */}
              <div className="form-group col-md-6">
                <label>Last Name</label>
                <Field
                  name="lastName"
                  placeholder="Last Name"
                  type="text"
                  className={
                    "form-control" +
                    (errors.lastName && touched.lastName ? " is-invalid" : "")
                  }
                />
                <div className="invalid-feedback">{errors.lastName}</div>
              </div>

              {/* email */}
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

              {/* contactNo */}
              <div className="form-group col-md-6">
                <label>Contact Number</label>
                <Field
                  name="contactNo"
                  placeholder="0770000000"
                  type="text"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  className={
                    "form-control" +
                    (errors.contactNo && touched.contactNo ? " is-invalid" : "")
                  }
                />
                <div className="invalid-feedback">{errors.contactNo}</div>
              </div>

              {/* password */}
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

              {/* confirmPassword */}
              <div className="form-group col-md-6">
                <label>Confirm Password</label>
                <Field
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  className={
                    "form-control" +
                    (errors.confirmPassword && touched.confirmPassword
                      ? " is-invalid"
                      : "")
                  }
                />
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              </div>

              {/* image */}
              <div className="form-group col-md-6">
                <label>Image</label>
                <Field
                  name="image"
                  type="file"
                  style={{ width: "300px" }}
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                  className={
                    "form-control" +
                    (errors.image && touched.image ? " is-invalid" : "")
                  }
                  required
                />
                <div className="invalid-feedback">{errors.image}</div>
              </div>

              {/* submit button */}
              {isSubmitted ? (
                <Button variant="primary" disabled>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  &nbsp; Processing...
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  style={{ marginLeft: "100px" }}
                >
                  Register
                </Button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Register;
