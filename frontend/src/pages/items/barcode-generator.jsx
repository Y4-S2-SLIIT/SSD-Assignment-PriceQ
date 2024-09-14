import { useState, useRef } from "react";

import Navbar from "../../components/navbar";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { useParams } from "react-router-dom";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import axios from "axios";

import "../../styles/randula/itemAdd.css";

export default function barcodegenerator() {
  const barcodeRef = useRef(null);
  const { itemID } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const generateBarcodeImage = () => {
    if (barcodeRef.current) {
      return html2canvas(barcodeRef.current).then((canvas) => {
        return canvas.toDataURL("image/png");
      });
    }
  };

  async function handleBarcodeSaveAndToMSRPGenerator() {
    await handleBarcodeSave().then(() => {
      window.location.href = `/msrp-generator/${itemID}`;
    }).catch((err) => {
      console.log(err);
    });
  }

  async function handleBarcodeSave() {
    setIsSubmitted(true);
    //get barcode as an image
    const barcodeImage = await generateBarcodeImage();

    //convert base64 to blob
    const byteString = atob(barcodeImage.split(",")[1]);
    const mimeString = barcodeImage.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const dw = new DataView(ab);
    for (let i = 0; i < byteString.length; i++) {
      dw.setUint8(i, byteString.charCodeAt(i));
    }
    const blob = new Blob([ab], { type: mimeString });

    //upload image to firebase
    const storageRef = ref(storage, `barcode/${itemID + v4()}`);
    await uploadBytes(storageRef, blob)
      .then(() => {
        console.log("Barcode Image Uploaded");
      })
      .catch((error) => {
        console.error("Error uploading barcode image:", error);
      });

    //get image url and update item details
    await getDownloadURL(storageRef)
      .then(async (url) => {
        console.log("Barcode Image URL:", url);
        //update item details

        const data = {
          barcode: url,
        };

        await axios
          .put(`${import.meta.env.VITE_BACKEND_URL}/item/${itemID}`, data)
          .then(() => {
            console.log("Item details updated");
            Swal.fire({
              icon: "success",
              title: "Barcode Saved",
              text: "Barcode saved successfully!",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              window.location.href = `/items-main/`;
            }).catch((err) => {
              console.log(err);
            });
          })
          .catch((error) => {
            console.error("Error updating item details:", error);
          });
      })
      .catch((error) => {
        console.error("Error getting barcode image url:", error);
      });
  }

  return (
    <>
      <Navbar />
      <div className="items-add-container barcodeContainer">
        <Row>
          <Col sm={4}>
            <h2>Barcode Generator</h2>
            <p>
              Each Item will have a unique barcode. <br />
              You can use this barcode to scan the item when you are selling it.
            </p>

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
              <>
                <Button className="custom-button" variant="primary" onClick={handleBarcodeSave}>
                  Save Barcode
                </Button>
                <Button
                  variant="primary"
                  onClick={handleBarcodeSaveAndToMSRPGenerator}
                  className="custom-button"
                >
                  Save Barcode & Generate MSRP
                </Button>
              </>
            )}
          </Col>
          <Col sm={8}>
            <div ref={barcodeRef}>
              <Barcode value={itemID} format="CODE39" />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
