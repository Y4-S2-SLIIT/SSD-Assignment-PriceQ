import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";

import { Tooltip } from "react-tooltip";

import { DotLoader, BeatLoader } from "react-spinners";

import "../../styles/chanudi/review.css";
import reviewImage from "../../assets/images/clothrev.webp";

import Navbar from "../../components/navbar";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function reviews() {
  const [newReviews, setNewReviews] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({});
  const [reviewCount, setReviewCount] = useState([]);

  const [items, setItems] = useState([]);

  const [showAll, setShowALl] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showStat, setShowStat] = useState(false);

  const handleCloseAll = () => setShowALl(false);
  const handleShowAll = () => setShowALl(true);

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const handleCloseStat = () => setShowStat(false);
  const handleShowStat = () => setShowStat(true);

  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleEditModel(record) {
    setReview(record);
    setShowEdit(true);
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/review/getNew`)
      .then((res) => {
        setNewReviews(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/review/item-count-by-rating`)
      .then((res) => {
        const reviewCountCheck = Object.keys(res.data).map((key) => ({
          rating: key,
          count: res.data[key],
        }));
        setReviewCount(reviewCountCheck);
        console.log(reviewCountCheck);
        console.log(reviewCount);
      });
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/review/`).then((res) => {
      setReviews(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/item/`).then((res) => {
      const sortedProducts = [...res.data];
      sortedProducts.sort((a, b) => {
        return a.brand.localeCompare(b.brand);
      });
      setItems(sortedProducts);
    });
  }, []);

  const reviewSchema = Yup.object().shape({
    itemID: Yup.string().required("Item is required"),
    description: Yup.string().required("Description is required"),
    rating: Yup.number().required("Rating is required"),
  });

  async function handleDelete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          axios.delete(`${import.meta.env.VITE_BACKEND_URL}/review/${id}`);
          Swal.fire({
            icon: "success",
            title: "Successful",
            text: "Deleted Successfully!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setReviews([]);
            setNewReviews([]);
            axios
              .get(`${import.meta.env.VITE_BACKEND_URL}/review/`)
              .then((res) => {
                setReviews(res.data);
              });

            axios
              .get(`${import.meta.env.VITE_BACKEND_URL}/review/getNew`)
              .then((res) => {
                setNewReviews(res.data);
              });
          });
        }
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

  async function handleAdd(values) {
    setIsSubmitted(true);
    console.log(values);
    const review = {
      itemID: values.itemID,
      description: values.description,
      rating: values.rating,
    };
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/review/`, review)
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Added Successfully!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setIsSubmitted(false);
          setShowAdd(false);
          setReviews([]);
          setNewReviews([]);
          axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/review/`)
            .then((res) => {
              setReviews(res.data);
            });

          axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/review/getNew`)
            .then((res) => {
              setNewReviews(res.data);
            });
        });
      })
      .catch((err) => {
        console.log(err);
        setIsSubmitted(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something is wrong !!",
        });
      });
  }

  async function handleEdit(values) {
    setIsSubmitted(true);
    console.log(values);
    console.log(values.id);
    const review = {
      itemID: values.itemID,
      description: values.description,
      rating: values.rating,
    };
    axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/review/${values.id}`, review)
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Edited Successfully!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setIsSubmitted(false);
          setShowEdit(false);
          setReviews([]);
          setNewReviews([]);
          axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/review/`)
            .then((res) => {
              setReviews(res.data);
            });

          axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/review/getNew`)
            .then((res) => {
              setNewReviews(res.data);
            });
        });
      })
      .catch((err) => {
        console.log(err);
        setIsSubmitted(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something is wrong !!",
        });
      });
  }

  const ReviewBarChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="rating" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  function printModalContent() {
    // Extract the modal content
    const modalContent = document.querySelector(".stat-modal-div");

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Write the modal content to the new window
    printWindow.document.write(`
      <html>
      <head>
        <title>Modal Content</title>
      </head>
      <body>
        ${modalContent.outerHTML}
      </body>
      </html>
    `);

    // Close the document for writing
    printWindow.document.close();

    // Print the content
    printWindow.print();

    // Close the new window after printing
    printWindow.close();
  }

  return (
    <>
      <Navbar />
      <div className="reviewContainer">
        <Row>
          <Col sm={1}></Col>
          <Col sm={5}>
            <h2 className="heading1">New Reviews</h2>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
            >
              {!newReviews.length ? (
                <>
                  <div
                    className="clock"
                    style={{ marginLeft: "150px", marginTop: "150px" }}
                  >
                    <BeatLoader color="#ffffff" />
                  </div>
                </>
              ) : (
                <>
                  {newReviews.map((review) => (
                    <>
                      <SwiperSlide className="centered-card" key={review.id}>
                        <img
                          src={review.item.image}
                          alt=""
                          className="reviewImg"
                        />
                        <h2>{review.item.name}</h2>
                        <h2>
                          {review.item.brand} - {review.item.type}
                        </h2>
                        <h2>Rating - {review.rating}/5</h2>
                        <br />
                      </SwiperSlide>
                    </>
                  ))}
                </>
              )}
            </Swiper>
          </Col>
          <Col sm={5}>
            <Row>
              <Image src={reviewImage} rounded className="rewImage" />
            </Row>
            <Row>
              <Col sm={4}>
                <Button variant="primary" onClick={handleShowAll}>
                  View All Reviews
                </Button>{" "}
              </Col>
              <Col sm={4}>
                <Button variant="primary" onClick={handleShowAdd}>
                  Add New Review
                </Button>{" "}
              </Col>
              <Col sm={4}>
                <Button variant="primary" onClick={handleShowStat}>
                  Review Statistics
                </Button>{" "}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <Modal
        show={showAll}
        onHide={handleCloseAll}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>All Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="reviewAll">
            {!reviews.length ? (
              <>
                <DotLoader color="#000000" />
              </>
            ) : (
              <>
                {reviews.map((review) => (
                  <>
                    <Card
                      style={{ width: "13rem", marginTop: "1rem" }}
                      key={review.id}
                      data-tooltip-id={review.id}
                    >
                      <Card.Img
                        variant="top"
                        src={review.item.image}
                        style={{ height: "80%" }}
                      />
                      <Card.Body>
                        <Card.Title>{review.item.name}</Card.Title>
                        <Card.Text>
                          {review.item.brand} - {review.item.type}
                        </Card.Text>
                        <Card.Text>Rating - {review.rating}/5</Card.Text>
                        <Button
                          variant="secondary"
                          onClick={() => handleEditModel(review)}
                        >
                          Edit
                        </Button>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(review.id)}
                        >
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>

                    <Tooltip
                      id={review.id}
                      place="top"
                      content={review.description}
                    />
                  </>
                ))}
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAdd}
        onHide={handleCloseAdd}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* review add form */}
          <Formik
            initialValues={{
              itemID: "",
              description: "",
              rating: "",
            }}
            validationSchema={reviewSchema}
            onSubmit={(values) => {
              handleAdd(values);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-group col-md-6" style={{ width: "450px" }}>
                  <label htmlFor="rating">Item</label>
                  <Field
                    name="itemID"
                    as="select"
                    style={{ width: "450px" }}
                    className={
                      "form-control" +
                      (errors.itemID && touched.itemID ? " is-invalid" : "")
                    }
                  >
                    <option value="" label="Select an Item" />
                    {items.map((item) => (
                      <option
                        value={item.id}
                        label={
                          item.brand + " - " + item.name + " - " + item.color
                        }
                        key={item.id}
                      />
                    ))}
                  </Field>
                  <div className="invalid-feedback">
                    {touched.itemID && errors.itemID ? errors.itemID : null}
                  </div>
                </div>
                <div className="form-group col-md-6" style={{ width: "300px" }}>
                  <label htmlFor="description">Description</label>
                  <Field
                    name="description"
                    id="description"
                    className={`form-control ${
                      touched.description && errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {touched.description && errors.description
                      ? errors.description
                      : null}
                  </div>
                </div>

                <div className="form-group col-md-6" style={{ width: "450px" }}>
                  <label htmlFor="rating">Rating</label>
                  <Field
                    name="rating"
                    as="select"
                    style={{ width: "450px" }}
                    className={
                      "form-control" +
                      (errors.rating && touched.rating ? " is-invalid" : "")
                    }
                  >
                    <option value="" label="Select a Rating" />
                    <option value="1" label="1" />
                    <option value="2" label="2" />
                    <option value="3" label="3" />
                    <option value="4" label="4" />
                    <option value="5" label="5" />
                  </Field>
                  <div className="invalid-feedback">
                    {touched.rating && errors.rating ? errors.rating : null}
                  </div>
                </div>
                <br />
                {isSubmitted ? (
                  <Button variant="primary" disabled>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    &nbsp; Submitting...
                  </Button>
                ) : (
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEdit}
        onHide={handleCloseEdit}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* review edit form */}
          <Formik
            initialValues={{
              id: review.id,
              itemID: review.itemID,
              description: review.description,
              rating: review.rating,
            }}
            validationSchema={reviewSchema}
            onSubmit={(values) => {
              handleEdit(values);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-group col-md-6" style={{ width: "450px" }}>
                  <label htmlFor="rating">Item</label>
                  <Field
                    name="itemID"
                    as="select"
                    style={{ width: "450px" }}
                    className={
                      "form-control" +
                      (errors.itemID && touched.itemID ? " is-invalid" : "")
                    }
                  >
                    <option value="" label="Select an Item" />
                    {items.map((item) => (
                      <option
                        value={item.id}
                        label={
                          item.brand + " - " + item.name + " - " + item.color
                        }
                        key={item.id}
                      />
                    ))}
                  </Field>
                  <div className="invalid-feedback">
                    {touched.itemID && errors.itemID ? errors.itemID : null}
                  </div>
                </div>
                <div className="form-group col-md-6" style={{ width: "300px" }}>
                  <label htmlFor="description">Description</label>
                  <Field
                    name="description"
                    id="description"
                    className={`form-control ${
                      touched.description && errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {touched.description && errors.description
                      ? errors.description
                      : null}
                  </div>
                </div>

                <div className="form-group col-md-6" style={{ width: "450px" }}>
                  <label htmlFor="rating">Rating</label>
                  <Field
                    name="rating"
                    as="select"
                    style={{ width: "450px" }}
                    className={
                      "form-control" +
                      (errors.rating && touched.rating ? " is-invalid" : "")
                    }
                  >
                    <option value="" label="Select a Rating" />
                    <option value="1" label="1" />
                    <option value="2" label="2" />
                    <option value="3" label="3" />
                    <option value="4" label="4" />
                    <option value="5" label="5" />
                  </Field>
                  <div className="invalid-feedback">
                    {touched.rating && errors.rating ? errors.rating : null}
                  </div>
                </div>
                <br />
                {isSubmitted ? (
                  <Button variant="primary" disabled>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    &nbsp; Submitting...
                  </Button>
                ) : (
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showStat}
        onHide={handleCloseStat}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <div className="stat-modal-div">
          <Modal.Header closeButton>
            <Modal.Title>Review Statistics</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="stat-card-body">
              <table className="stat-table">
                <thead>
                  <tr>
                    <th>Rating</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewCount.map((item) => (
                    <tr key={item.rating}>
                      <td>{item.rating}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="stat-graph-card-body">
              <div className="stat-graph-container">
                <ReviewBarChart data={reviewCount} />
              </div>
            </div>
          </Modal.Body>
        </div>
        <Modal.Footer>
          <Button variant="primary" onClick={printModalContent}>
            Print
          </Button>
          <Button variant="secondary" onClick={handleCloseStat}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
