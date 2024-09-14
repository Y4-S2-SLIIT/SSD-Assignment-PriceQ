import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import Navbar from "../../components/navbar";

import "../../styles/chanudi/profile.css";
import deleteImg from "../../assets/images/3807871.png";

export default function profile() {
  const userID = sessionStorage.getItem("userid");

  const [user, setUser] = useState({});

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [image, setImage] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const userSchema = Yup.object().shape({
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
  });

  //password update schema
  const UpdatePasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  async function updateProfile(values) {
    //upload image to firebase
    console.log("Please wait while we upload your image");
    const storageRef = ref(storage, `user/${user.id + v4()}`);

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
        image: url,
      };
      await axios
        .put(`${import.meta.env.VITE_BACKEND_URL}/user/${user.id}`, data)
        .then((res) => {
          console.log(res);
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: "Updated Successfully!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something is wrong !!",
          });
        });
    });
  }

  async function updatePassword(values) {
    const data = {
      password: values.password,
    };
    console.log(data);

    await axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/user/${user.id}`, data)
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Updated Successfully!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something is wrong !!",
        });
      });
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/user/${userID}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [userID]);

  async function handleDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`${import.meta.env.VITE_BACKEND_URL}/user/${user.id}`)
          .then((res) => {
            console.log(res);
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: "Deleted Successfully!",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              sessionStorage.clear();
              window.location.href = "/";
            });
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Something is wrong !!",
            });
          });
      }
    });
  }

  return (
    <>
      {/* profile edit modal */}
      <Modal
        show={showEdit}
        onHide={handleCloseEdit}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="header" closeButton>
          <Modal.Title>Edit Profile - {user.firstName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <div>
                <Formik
                  initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    contactNo: user.contactNo,
                  }}
                  validationSchema={userSchema}
                  onSubmit={(values) => {
                    console.log(values);
                    setIsSubmitted(true);
                    updateProfile(values);
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
                            (errors.firstName && touched.firstName
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <div className="invalid-feedback">
                          {errors.firstName}
                        </div>
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
                            (errors.lastName && touched.lastName
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <div className="invalid-feedback">
                          {errors.lastName}
                        </div>
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
                          disabled
                        />
                        <div className="invalid-feedback">{errors.email}</div>
                      </div>

                      {/* contactNo */}
                      <div className="form-group col-md-6">
                        <label>Contact Number</label>
                        <Field
                          name="contactNo"
                          placeholder="+94770000000"
                          type="text"
                          className={
                            "form-control" +
                            (errors.contactNo && touched.contactNo
                              ? " is-invalid"
                              : "")
                          }
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                        />
                        <div className="invalid-feedback">
                          {errors.contactNo}
                        </div>
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

                      <br />
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
                        <Button variant="primary" type="submit">
                          Update Profile
                        </Button>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Danger select modal */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header className="header" closeButton>
          <Modal.Title>Security Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Card style={{ width: "22rem" }}>
                <Card.Body>
                  {!user.isoAuth && (
                    <>
                      <Card.Title>Update Password</Card.Title><Formik
                        initialValues={{
                          password: "",
                          confirmPassword: "",
                        }}
                        validationSchema={UpdatePasswordSchema}
                        onSubmit={(values) => {
                          updatePassword(values);
                        }}
                      >
                        {({ errors, touched }) => (
                          <Form>
                            {/* password */}
                            <div className="form-group col-md-6">
                              <label htmlFor="password">Password</label>
                              <Field
                                name="password"
                                type="password"
                                className={"form-control" +
                                  (errors.password && touched.password
                                    ? " is-invalid"
                                    : "")} />
                              <div className="invalid-feedback">
                                {errors.password}
                              </div>
                            </div>

                            {/* confirm password */}
                            <div className="form-group col-md-6">
                              <label htmlFor="confirmPassword">
                                Confirm Password
                              </label>
                              <Field
                                name="confirmPassword"
                                type="password"
                                className={"form-control" +
                                  (errors.confirmPassword && touched.confirmPassword
                                    ? " is-invalid"
                                    : "")} />
                              <div className="invalid-feedback">
                                {errors.confirmPassword}
                              </div>
                            </div>

                            <br />
                            <div className="form-group">
                              <button
                                type="submit"
                                className="btn btn-primary mr-2"
                              >
                                Update Password
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: "22rem", height: "20rem" }}>
                <Card.Body>
                  <Card.Img
                    variant="top"
                    src={deleteImg}
                    style={{
                      width: "100px",
                      marginLeft: "100px",
                      marginTop: "50px",
                      marginBottom: "50px",
                    }}
                  />
                  <br /> <br />
                  <Card.Title>Delete This User Account</Card.Title>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    Delete Account
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Navbar />

      <div className="profileContainer">
        <Row>
          <Col className="colmn1" sm={6}>
            <img
              src={user.image}
              className="userImg"
              alt="user image"
              loading=" lazy"
            />
          </Col>
          <Col className="colmn2" sm={6}>
            <Card style={{ width: "36rem" }}>
              <Card.Body>
                <Card.Title>
                  <b>User Details</b>
                </Card.Title>
                <br />
                <Card.Text>First Name: {user.firstName}</Card.Text>
                <Card.Text>Last Name: {user.lastName}</Card.Text>
                <Card.Text>Email: {user.email}</Card.Text>
                <Card.Text>Phone: {user.contactNo}</Card.Text>
              </Card.Body>
            </Card>
            <br />
            <br />
            <Row>
              <Col sm={2}></Col>
              <Col sm={4}>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleShowEdit();
                  }}
                >
                  Update Profile
                </Button>{" "}
              </Col>
              <Col>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleShow();
                  }}
                >
                  Security Information
                </Button>{" "}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
