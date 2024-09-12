import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import BarLoader from "react-spinners/BarLoader";

import { useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar";
import "../../styles/sudul/ItemsMain.css";
import "../../styles/randula/dashboard.css";

import Brands from "../../assets/data/brand.json";
import Colors from "../../assets/data/color.json";
import Types from "../../assets/data/type.json";

function ItemsMain() {
  const navigate = useNavigate();
  // const listInnerRef = useRef();

  const [allItems, setAllItems] = useState([]);
  const [item, setItem] = useState({});
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [brandList, setBrandList] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [image, setImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleView = (item) => {
    setItem(item);
    handleShow();
  };

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const handleEdit = (item) => {
    setItem(item);
    handleShowEdit();
  };

  const handleCloseStats = () => setShowStats(false);
  const handleShowStats = () => setShowStats(true);

  useEffect(() => {
    getAllItems();
  }, []);

  const getAllItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/item/`
      );
      setAllItems(response.data);
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/item/count-by-brand`)
        .then((res) => {
          const BrandCountCheck = Object.keys(res.data).map((key) => ({
            name: key,
            count: res.data[key],
          }));
          setBrandList(BrandCountCheck);
        });

      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/item/count-by-color`)
        .then((res) => {
          const ColorCountCheck = Object.keys(res.data).map((key) => ({
            name: key,
            count: res.data[key],
          }));
          setColorList(ColorCountCheck);
        });

      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/item/count-by-type`)
        .then((res) => {
          const TypeCountCheck = Object.keys(res.data).map((key) => ({
            name: key,
            count: res.data[key],
          }));
          setTypeList(TypeCountCheck);
        });
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // const onScroll = () => {
  //   if (listInnerRef.current) {
  //     const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
  //     console.log("scrolling", scrollTop, scrollHeight, clientHeight);
  //     if (scrollTop + clientHeight === scrollHeight) {
  //       console.log("scrolling end");
  //       // This will be triggered after hitting the last element.
  //       // API call should be made here while implementing pagination.
  //       alert("You have reached the bottom of the list");
  //       setPrevPage(currPage);
  //       setCurrPage(currPage + 1);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_BACKEND_URL}/item/paged/?page=${currPage}&size=15`
  //     );
  //     if (!response.data.content.length) {
  //       setWasLastList(true);
  //       return;
  //     }
  //     setPrevPage(currPage);
  //     setAllItems([...userList, ...response.data.content]);
  //   };
  //   if (!wasLastList && prevPage !== currPage) {
  //     fetchData();
  //   }
  // }, [currPage, wasLastList, prevPage, userList]);

  useEffect(() => {
    const tableContainer = $(".item-list");

    tableContainer.scroll(() => {
      const scrollTop = $(this).scrollTop();
      const header = $(this).find("itemTableHead");

      header.css("trasform", `translateY(${scrollTop}px)`);
    });
  }, []);

  const itemSchema = Yup.object().shape({
    itemCode: Yup.string()
      .required("Required")
      .max(10, "Too Long!")
      .min(5, "Too Short!"),
    name: Yup.string()
      .required("Required")
      .max(50, "Too Long!")
      .min(5, "Too Short!"),
    description: Yup.string()
      .required("Required")
      .max(100, "Too Long!")
      .min(5, "Too Short!"),
    brand: Yup.string()
      .required("Required")
      .max(50, "Too Long!")
      .min(3, "Too Short!"),
    color: Yup.string()
      .required("Required")
      .max(50, "Too Long!")
      .min(3, "Too Short!"),
    type: Yup.string()
      .required("Required")
      .max(50, "Too Long!")
      .min(5, "Too Short!"),
    //hsrp as number cant be minus
    cost: Yup.number().required("Required").positive("Cannot be negative"),
    hsrp: Yup.number().required("Required").positive("Cannot be negative"),
    retailPrice: Yup.number()
      .required("Required")
      .positive("Cannot be negative"),
    quantity: Yup.number().required("Required").positive("Cannot be negative"),
  });

  async function updateItem(values) {
    //upload image to firebase
    console.log("Please wait while we upload your image");
    const storageRef = ref(storage, `item/${image.name + v4()}`);

    await uploadBytes(storageRef, image)
      .then(() => {
        console.log("uploaded");
      })
      .catch((err) => {
        console.log(err);
      });

    //get image url and create item
    await getDownloadURL(storageRef).then(async (url) => {
      console.log(url);
      const data = {
        itemCode: values.itemCode,
        name: values.name,
        description: values.description,
        brand: values.brand,
        color: values.color,
        type: values.type,
        cost: values.cost,
        hsrp: values.hsrp,
        retailPrice: values.retailPrice,
        quantity: values.quantity,
        image: url,
      };
      await axios
        .put(`${import.meta.env.VITE_BACKEND_URL}/item/${item.id}`, data)
        .then((res) => {
          console.log(res.data);
          sessionStorage.setItem("itemJustAdded", data);
          Swal.fire({
            icon: "success",
            title: "Item Updated Successfully",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            handleCloseEdit();
            setItem({});
            getAllItems();
            setIsSubmitted(false);
          });
        })
        .catch((err) => {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    });
  }

  async function handleDelete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`${import.meta.env.VITE_BACKEND_URL}/item/${id}`)
          .then((res) => {
            console.log(res.data);
            Swal.fire({
              icon: "success",
              title: "Item Deleted Successfully",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              getAllItems();
            });
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      }
    });
  }

  function printModalContent() {
    // Extract the modal content
    const modalContent = document.querySelector(".stat-modal-div");

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Write the modal content to the new window
    printWindow.document.write(`
      <html>
      <head>
        <title>Item Statistics</title>
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
      {/* item view modal */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>View Item - {item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Table striped>
                <tbody>
                  <tr>
                    <td>Item Code</td> <td>{item.itemCode}</td>
                  </tr>
                  <tr>
                    <td>Item Name</td> <td>{item.name}</td>
                  </tr>
                  <tr>
                    <td>Item Brand</td> <td>{item.brand}</td>
                  </tr>
                  <tr>
                    <td>Item Color</td> <td>{item.color}</td>
                  </tr>
                  <tr>
                    <td>Item Type</td> <td>{item.type}</td>
                  </tr>
                  <tr>
                    <td>Quantity</td> <td>{item.quantity}</td>
                  </tr>
                </tbody>
              </Table>
              <Card style={{ width: "18rem", minHeight: "10rem" }}>
                <Card.Body>
                  <Card.Title>Description</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                </Card.Body>
              </Card>
              <br />
              <br />
              <Table striped>
                <tbody>
                  <tr>
                    <td>HSRP </td> <td>$ {item.hsrp}</td>
                  </tr>
                  <tr>
                    <td>Retail Price</td> <td>$ {item.retailPrice}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>

            <Col>
              <img
                src={item.image}
                alt="item image"
                style={{ maxHeight: "15rem" }}
              />
              <br />
              <br />
              <h5>Bar Code</h5>
              <img
                src={item.barcode}
                alt="item image"
                style={{ maxWidth: "25rem" }}
              />
              <br />
              <br />
              <Button variant="primary" target="_blank" href={item.barcode}>
                View Barcode
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  window.location.href = `/msrp-generator/${item.id}`;
                }}
              >
                Calculate MSRP
              </Button>
              <br />
              <br />
              <br />
              <Table striped>
                <tbody>
                  <tr>
                    <td>MSRP</td>
                    <td>
                      {item.msrp === 0 ? (
                        <span>Not Calculated Yet ...</span>
                      ) : (
                        <span>$ {item.msrp}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Manufactuere Cost</td>
                    <td>$ {item.cost}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* item edit modal */}
      <Modal
        show={showEdit}
        onHide={handleCloseEdit}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Item - {item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <div>
                <Formik
                  initialValues={{
                    itemCode: item.itemCode,
                    name: item.name,
                    description: item.description,
                    brand: item.brand,
                    color: item.color,
                    type: item.type,
                    cost: item.cost,
                    hsrp: item.type,
                    retailPrice: item.retailPrice,
                    quantity: item.quantity,
                  }}
                  validationSchema={itemSchema}
                  onSubmit={(values) => {
                    setIsSubmitted(true);
                    console.log(values);
                    updateItem(values);
                  }}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Row style={{ display: "flex" }}>
                        <Col style={{ flex: 1 }}>
                          {/* itemCode */}
                          <div className="form-group col-md-6">
                            <label>Item Code</label>
                            <Field
                              name="itemCode"
                              type="text"
                              className={
                                "form-control" +
                                (errors.itemCode && touched.itemCode
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <div className="invalid-feedback">
                              {errors.itemCode}
                            </div>
                          </div>

                          {/* name */}
                          <div className="form-group col-md-6">
                            <label>Name</label>
                            <Field
                              name="name"
                              type="text"
                              className={
                                "form-control" +
                                (errors.name && touched.name
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <div className="invalid-feedback">
                              {errors.name}
                            </div>
                          </div>

                          {/* description */}
                          <div className="form-group col-md-6">
                            <label>Description</label>
                            <Field
                              name="description"
                              type="text"
                              className={
                                "form-control" +
                                (errors.description && touched.description
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <div className="invalid-feedback">
                              {errors.description}
                            </div>
                          </div>

                          {/* brand dropdown*/}
                          <div
                            className="form-group col-md-6"
                            style={{ width: "300px" }}
                          >
                            <label>Brand</label>
                            <Field
                              name="brand"
                              as="select"
                              style={{ width: "300px" }}
                              className={
                                "form-control" +
                                (errors.brand && touched.brand
                                  ? " is-invalid"
                                  : "")
                              }
                            >
                              <option value="" label="Select a Brand" />
                              {Brands.map((brand) => {
                                return (
                                  <option
                                    key={brand.id}
                                    value={brand.name}
                                    label={brand.name}
                                  />
                                );
                              })}
                            </Field>
                            <div className="invalid-feedback">
                              {errors.brand}
                            </div>
                          </div>

                          {/* color dropdown*/}
                          <div
                            className="form-group col-md-6"
                            style={{ width: "300px" }}
                          >
                            <label>Color</label>
                            <Field
                              name="color"
                              as="select"
                              style={{ width: "300px" }}
                              className={
                                "form-control" +
                                (errors.color && touched.color
                                  ? " is-invalid"
                                  : "")
                              }
                            >
                              <option value="" label="Select a Color" />
                              {Colors.map((color) => {
                                return (
                                  <option
                                    key={color.id}
                                    value={color.name}
                                    label={color.name}
                                  />
                                );
                              })}
                            </Field>
                            <div className="invalid-feedback">
                              {errors.color}
                            </div>
                          </div>

                          {/* type dropdown*/}
                          <div
                            className="form-group col-md-6"
                            style={{ width: "300px" }}
                          >
                            <label>Type</label>
                            <Field
                              name="type"
                              as="select"
                              style={{ width: "300px" }}
                              className={
                                "form-control" +
                                (errors.type && touched.type
                                  ? " is-invalid"
                                  : "")
                              }
                            >
                              <option value="" label="Select a Type" />
                              {Types.map((type) => {
                                return (
                                  <option
                                    key={type.id}
                                    value={type.name}
                                    label={type.name}
                                  />
                                );
                              })}
                            </Field>
                            <div className="invalid-feedback">
                              {errors.type}
                            </div>
                          </div>
                        </Col>

                        {/* break */}
                        <Col style={{ flex: 1 }}>
                          {/* cost */}
                          <div className="form-group col-md-6">
                            <label>Cost</label>
                            <Field
                              name="cost"
                              type="text"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              className={
                                "form-control" +
                                (errors.cost && touched.cost
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <div className="invalid-feedback">
                              {errors.cost}
                            </div>
                          </div>

                          {/* hsrp */}
                          <div className="form-group col-md-6">
                            <label>HSRP</label>
                            <Field
                              name="hsrp"
                              type="text"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              className={
                                "form-control" +
                                (errors.hsrp && touched.hsrp
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <div className="invalid-feedback">
                              {errors.hsrp}
                            </div>
                          </div>

                          {/* retailPrice */}
                          <div className="form-group col-md-6">
                            <label>Retail Price</label>
                            <Field
                              name="retailPrice"
                              type="text"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              className={
                                "form-control" +
                                (errors.retailPrice && touched.retailPrice
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <div className="invalid-feedback">
                              {errors.retailPrice}
                            </div>
                          </div>

                          {/* quantity */}
                          <div className="form-group col-md-6">
                            <label>Quantity</label>
                            <Field
                              name="quantity"
                              type="text"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                              }}
                              className={
                                "form-control" +
                                (errors.quantity && touched.quantity
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <div className="invalid-feedback">
                              {errors.quantity}
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
                                (errors.image && touched.image
                                  ? " is-invalid"
                                  : "")
                              }
                              required
                            />
                            <div className="invalid-feedback">
                              {errors.image}
                            </div>
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
                              Edit Item
                            </Button>
                          )}
                        </Col>
                      </Row>
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

      {/* item stats modal */}
      <Modal
        show={showStats}
        onHide={handleCloseStats}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Item Statistics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="stat-modal-div">
            <Alert variant="primary">Count By Clothing Brands</Alert>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Clothing Brand</th>
                  <th>No of Items</th>
                </tr>
              </thead>
              <tbody>
                {brandList.map((brand, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{brand.name}</td>
                      <td>{brand.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Alert variant="success">Count By Clothing Types</Alert>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Clothing Type</th>
                  <th>No of Items</th>
                </tr>
              </thead>
              <tbody>
                {typeList.map((type, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{type.name}</td>
                      <td>{type.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Alert variant="dark">Count By Clothing Colors</Alert>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Brand</th>
                  <th>No of Items</th>
                </tr>
              </thead>
              <tbody>
                {colorList.map((color, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{color.name}</td>
                      <td>{color.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStats}>
            Close
          </Button>
          <Button variant="primary" onClick={printModalContent}>
            Print Statistics
          </Button>
        </Modal.Footer>
      </Modal>

      <Navbar />
      <div className="items-container-main">
        <Row>
          <Col sm={5}>
            <Button
              onClick={() => {
                navigate("/item-add");
              }}
            >
              Add New Item
            </Button>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <Button onClick={handleShowStats}>Get Item Statistic</Button>
          </Col>
          <Col sm={3}>
            <h2>All Items</h2>
          </Col>
          <Col sm={4}>
            {/* search bar */}
            <div className="search">
              <input
                type="text"
                placeholder="Search Items..."
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </div>
          </Col>
        </Row>
        <div className="item-list">
          <Table striped bordered hover className="ItemTable">
            <thead className="itemTableHead">
              <tr>
                <th>Name</th>
                <th>Item Code</th>
                <th>Item Brand</th>
                <th>Item Type</th>
                <th>Available Quantity</th>
                <th>Retail Price</th>
                <th>View Item</th>
                <th>Edit Item</th>
                <th>Delete Item</th>
              </tr>
            </thead>
            <tbody>
              {!allItems.length ? (
                <>
                  <tr>
                    <td colSpan={9}>
                      <BarLoader color="#36d7b7" width={1100} />
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {allItems
                    .filter((val) => {
                      if (searchTerm === "") {
                        return val;
                      } else if (
                        val.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        val.itemCode
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ) {
                        return val;
                      }
                    })
                    .map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.itemCode}</td>
                          <td>{item.brand}</td>
                          <td>{item.type}</td>
                          <td>{item.quantity}</td>
                          <td>$ {item.retailPrice}</td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() => {
                                handleView(item);
                              }}
                            >
                              View
                            </Button>
                          </td>
                          <td>
                            <Button
                              variant="warning"
                              onClick={() => {
                                handleEdit(item);
                              }}
                            >
                              Edit
                            </Button>
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => {
                                handleDelete(item.id);
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default ItemsMain;
