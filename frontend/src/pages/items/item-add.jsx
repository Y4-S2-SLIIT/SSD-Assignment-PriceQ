import { useState } from "react";
import Navbar from "../../components/navbar";
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

import Brands from "../../assets/data/brand.json"
import Colors from "../../assets/data/color.json"
import Types from "../../assets/data/type.json"
import ItemAdd from "../../assets/images/itemAdd.png"

import "../../styles/randula/itemAdd.css";

export default function addItems() {

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [image, setImage] = useState("");

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
        cost: Yup.number()
            .required("Required")
            .positive("Cannot be negative"),
        hsrp: Yup.number()
            .required("Required")
            .positive("Cannot be negative"),
        retailPrice: Yup.number()
            .required("Required")
            .positive("Cannot be negative"),
        quantity: Yup.number()
            .required("Required")
            .positive("Cannot be negative"),
    });

    async function createItem(values) {
        //upload image to firebase
        const storageRef = ref(storage, `item/${image.name + v4()}`);

        await uploadBytes(storageRef, image)
            .then(() => {
                console.log("uploaded");
            })
            .catch((err) => {
                console.log(err);
            });

        //get image url and create item
        await getDownloadURL(storageRef)
            .then(async (url) => {
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
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/item/`, data)
                    .then((res) => {
                        console.log(res.data);
                        sessionStorage.setItem('itemJustAdded', data);
                        Swal.fire({
                            icon: "success",
                            title: "Item Added Successfully",
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(() => {
                            window.location.href = `/barcode-generator/${res.data.id}`;
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
            })
    }

    return (
        <>
            <Navbar />
            <div className="items-add-container">
                <Row>
                    <Col className="col1" sm={8}>
                        <div className="item-add-list">
                            <h2>Add New Item</h2>
                            <Formik
                                initialValues={{
                                    itemCode: "",
                                    name: "",
                                    description: "",
                                    brand: "",
                                    color: "",
                                    type: "",
                                    cost: "",
                                    hsrp: "",
                                    retailPrice: "",
                                    quantity: "",
                                }}
                                validationSchema={itemSchema}
                                onSubmit={(values) => {
                                    setIsSubmitted(true);
                                    createItem(values);
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
                                                            (errors.itemCode && touched.itemCode ? " is-invalid" : "")
                                                        }
                                                    />
                                                    <div className="invalid-feedback">{errors.itemCode}</div>
                                                </div>

                                                {/* name */}
                                                <div className="form-group col-md-6">
                                                    <label>Name</label>
                                                    <Field
                                                        name="name"
                                                        type="text"
                                                        className={
                                                            "form-control" +
                                                            (errors.name && touched.name ? " is-invalid" : "")
                                                        }
                                                    />
                                                    <div className="invalid-feedback">{errors.name}</div>
                                                </div>

                                                {/* description */}
                                                <div className="form-group col-md-6">
                                                    <label>Description</label>
                                                    <Field
                                                        name="description"
                                                        type="text"
                                                        className={
                                                            "form-control" +
                                                            (errors.description && touched.description ? " is-invalid" : "")
                                                        }
                                                    />
                                                    <div className="invalid-feedback">{errors.description}</div>
                                                </div>

                                                {/* brand dropdown*/}
                                                <div className="form-group col-md-6" style={{ width: "300px" }}>
                                                    <label>Brand</label>
                                                    <Field
                                                        name="brand"
                                                        as="select"
                                                        style={{ width: "300px" }}
                                                        className={
                                                            "form-control" +
                                                            (errors.brand && touched.brand ? " is-invalid" : "")
                                                        }
                                                    >
                                                        <option value="" label="Select a Brand" />
                                                        {Brands.map((brand) => {
                                                            return (
                                                                <option key={brand.id} value={brand.name} label={brand.name} />
                                                            );
                                                        })}
                                                    </Field>
                                                    <div className="invalid-feedback">{errors.brand}</div>
                                                </div>


                                                {/* color dropdown*/}
                                                <div className="form-group col-md-6" style={{ width: "300px" }}>
                                                    <label>Color</label>
                                                    <Field
                                                        name="color"
                                                        as="select"
                                                        style={{ width: "300px" }}
                                                        className={
                                                            "form-control" +
                                                            (errors.color && touched.color ? " is-invalid" : "")
                                                        }
                                                    >
                                                        <option value="" label="Select a Color" />
                                                        {Colors.map((color) => {
                                                            return (
                                                                <option key={color.id} value={color.name} label={color.name} />
                                                            );
                                                        })}
                                                    </Field>
                                                    <div className="invalid-feedback">{errors.color}</div>
                                                </div>

                                                {/* type dropdown*/}
                                                <div className="form-group col-md-6" style={{ width: "300px" }}>
                                                    <label>Type</label>
                                                    <Field
                                                        name="type"
                                                        as="select"
                                                        style={{ width: "300px" }}
                                                        className={
                                                            "form-control" +
                                                            (errors.type && touched.type ? " is-invalid" : "")
                                                        }
                                                    >
                                                        <option value="" label="Select a Type" />
                                                        {Types.map((type) => {
                                                            return (
                                                                <option key={type.id} value={type.name} label={type.name} />
                                                            );
                                                        })}
                                                    </Field>
                                                    <div className="invalid-feedback">{errors.type}</div>
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
                                                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                        }}
                                                        className={
                                                            "form-control" +
                                                            (errors.cost && touched.cost ? " is-invalid" : "")
                                                        }
                                                    />
                                                    <div className="invalid-feedback">{errors.cost}</div>
                                                </div>
                                                {/* hsrp */}
                                                <div className="form-group col-md-6">
                                                    <label>HSRP</label>
                                                    <Field
                                                        name="hsrp"
                                                        type="text"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                        }}
                                                        className={
                                                            "form-control" +
                                                            (errors.hsrp && touched.hsrp ? " is-invalid" : "")
                                                        }
                                                    />
                                                    <div className="invalid-feedback">{errors.hsrp}</div>
                                                </div>

                                                {/* retailPrice */}
                                                <div className="form-group col-md-6">
                                                    <label>Retail Price</label>
                                                    <Field
                                                        name="retailPrice"
                                                        type="text"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                        }}
                                                        className={
                                                            "form-control" +
                                                            (errors.retailPrice && touched.retailPrice ? " is-invalid" : "")
                                                        }
                                                    />
                                                    <div className="invalid-feedback">{errors.retailPrice}</div>
                                                </div>

                                                {/* quantity */}
                                                <div className="form-group col-md-6">
                                                    <label>Quantity</label>
                                                    <Field
                                                        name="quantity"
                                                        type="text"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                        }}
                                                        className={
                                                            "form-control" +
                                                            (errors.quantity && touched.quantity ? " is-invalid" : "")
                                                        }
                                                    />
                                                    <div className="invalid-feedback">{errors.quantity}</div>
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
                                                        Add Item
                                                    </Button>
                                                )}
                                            </Col>
                                        </Row>
                                    </Form>
                                )}
                            </Formik>
                            <br />
                            <br />
                        </div>

                    </Col>
                    <Col className="col2" sm={4} style={{ overflow: "hidden", padding: "0" }}>
                        <img src={ItemAdd} alt="itemAdd" />
                    </Col>
                </Row>
            </div>
        </>
    )
}
