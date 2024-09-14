import React, { useEffect, useState} from "react";
import axios from "axios";
import Select from "react-select";
import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";

import "../../styles/madusha/cashier-main.css";
import Navbar from "../../components/navbar";
// import { OrderedItemAdd } from "../../components/ordereditem-add";
import SalesSummaryReport from "./sales-summary-report";

const CashierMain = () => {
  const [selectedItem, setSelectedItem] = useState([]);
  const [orderedItems, setOrderedItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [ options, setOptions ] = useState(null);
  const [item, setItem] = useState([]);
  const [show, setShow] = useState(false);
  const [specificOrders, setSpecificOrders] = useState([]);
  const [orderOptions, setOrderOptions] = useState([]);
  let orderId = null;  

  const [discounts, setDiscounts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [discountIndex, setDiscountIndex] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleView = () => {
    handleShow();
  };

  const handleOpenDialog = (index) => {
    setDiscountIndex(index); // Set the index for the discount to be updated
    setShowDialog(true);
  };

const handleCloseDialog = () => {
  setShowDialog(false);
};

const handleUpdateDiscount = () => {
    if (discounts[discountIndex] !== '') {
      setDiscounts((prevDiscounts) => {
        const updatedDiscounts = [...prevDiscounts];
        updatedDiscounts[discountIndex] = parseFloat(discounts[discountIndex]);
        return updatedDiscounts;
      });
    }
    setShowDialog(false);
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const getAllItems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/item/`
      );
    //   console.log(response.data);
      setAllItems(response.data);

      const option = response.data.map((item) => ({
        value: item.id,
        label: item.name,
        }));
        setOptions(option);
        console.log("Options " + options);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  useEffect(() => {
    getItem();
}, [selectedItem]);

  const getItem = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/item/${selectedItem}`
      );
      console.log("specific item: " + response.data);
      setItem(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ordereditem/`
      );
      setAllOrders(response.data);
      console.log('all orders: '+ allOrders);

      allOrders.forEach((order) => {
        if (order.orderId !== specificOrders.orderId) {
          setSpecificOrders((prevOrders) => [...prevOrders, order]);
        }
      });
      console.log('specific orders: '+ specificOrders);

      // const orderOption = specificOrders.map((order) => ({
      //   value: order.orderId,
      //   label: order.orderId,
      //   }));
      //   setOrderOptions(orderOption);
      //   console.log("Options " + orderOptions);

    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    // This will execute whenever specificOrders changes
    const orderOption = specificOrders.map((order) => ({
      value: order.orderId,
      label: order.orderId,
    }));
    setOrderOptions(orderOption);
    console.log("orderOptions " + orderOptions);
  }, [specificOrders]);

  async function addOrderedItem() {
    //upload image to firebase
    const values = [...orderedItems];

    if (allOrders.length === 0) {
      orderId = 1000;
    } else {
      allOrders.forEach((order) => {
        if (order.id > orderId) {
          orderId = order.id;
          console.log('order id: ' + orderId);
        }
      });
    }

    values.forEach(async (item, index) => {
        const data = {
            orderId: orderId + 1,
            itemCode: item.itemCode,
            name: item.name,
            barcode: item.barcode,
            description: item.description,
            orderedquantity: 1,
            brand: item.brand,
            retailPrice: item.retailPrice,
            discountPrice: item.retailPrice*(discounts[index]/100) || 0,
            sellingPrice: item.retailPrice - item.retailPrice*(discounts[index]/100) ||  item.retailPrice,
        };
        await axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/ordereditem/`, data)
            .then((res) => {
            console.log(res.data);
            sessionStorage.setItem("itemJustAdded", data);
            })
            .catch((err) => {
            console.log(err);
            });
        });
  }

  async function updateItems(orderedItems) {
    //upload image to firebase
    const values = [...orderedItems];

    values.forEach(async (item) => {
        const data = {
            quantity: item.quantity - 1,
        };
        await axios
            .put(`${import.meta.env.VITE_BACKEND_URL}/item/${item.id}`, data)
            .then((res) => {
            console.log(res.data);
            sessionStorage.setItem("itemJustAdded", data);
            })
            .catch((err) => {
            console.log(err);
            });
        });
  }

  const handleSelectItem = (selectedOption) => {
    setSelectedItem(selectedOption.value);
  };

  const handleOrderItem = (item) => {
        setOrderedItems((prevItems) => [...prevItems, item]);
  };

  const removeItem = (itemId) => {
    const updatedItems = orderedItems.filter((item) => item.id !== itemId);
    setOrderedItems(updatedItems);
  };

  function PurchaseOrder() {
    Swal.fire({
        title: 'Do you want to made the purchase?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
            addOrderedItem();
            setSelectedItem(null);
            window.location.reload();
            updateItems(orderedItems);
            Swal.fire('Purchased!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Purchase Denied', '', 'info')
        }
      }).catch((err) => {
        console.log(err);
      });

  }

  return (
    <>
    <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Order to Generate Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="select-order-no-div">
            <Select
              options={orderOptions} 
              onChange={handleSelectItem}
              value={selectedItem}
            />
          </div>   
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
            Select Order
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    <div>
      <Navbar />
      <h1 className="cashier-main-title">Cashier</h1>
      <div className="dropdown-container">
      <Select
        options={options} 
        onChange={handleSelectItem}
        value={selectedItem}
      />
      </div>
      <div className="box-container">
      {selectedItem && (
        <div className="items-container-mad">
        <div className="item-list">
        <h2 className="sub-heading">{item.name} Item</h2>
        <div className="rentcont">
        <div className="rent">
          <p>Name:                {item.name}</p>
          <p>Item Code :          {item.itemCode}</p>
          <p>Item Brand :         {item.brand}</p>
          <p>Available Quantity : {item.quantity}</p>
          <p>Retail Price :       {item.retailPrice}</p>
          <button onClick={() => handleOrderItem(item)}>Order</button>
        </div>
        </div>
        </div>
        </div>
      )}
      </div>
      <div className="order-table">
        <h2>Ordered Items</h2>
        {orderedItems && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Item Brand</th>
              <th>Quantity</th>
              <th>Retail Price</th>
              <th>Discount</th>
              <th>Selling Price</th>
              <th>Set Discount</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {orderedItems.map((sitem, index) => (
              <tr key={index}>
                  <td>{sitem.name}</td>
                  <td>{sitem.itemCode}</td>
                  <td>{sitem.name}</td>
                  <td>{sitem.brand}</td>
                  <td>1</td>
                  <td>${sitem.retailPrice}</td>
                  <td>{discounts[index] || 0}%</td>
                  <td>${(sitem.retailPrice - sitem.retailPrice*(discounts[index]/100).toFixed(2)) ||  sitem.retailPrice}</td>
                  <td><Button variant="warning" onClick={() => handleOpenDialog(index)}>Set Discount</Button>{' '}</td>
                  <td><Button variant="warning" onClick={() => removeItem(sitem.id)}>Remove Item</Button>{' '}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        )}
        {showDialog && (
            <div className="showdialog-container">
            <h3>Update Discount Price</h3>
            <input
              type="number"
              placeholder="New Discount Price"
              max="100"
              value={discounts[discountIndex] || ''}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue >= 1 && inputValue <= 100) {
                  setDiscounts((prevDiscounts) => {
                    const updatedDiscounts = [...prevDiscounts];
                    updatedDiscounts[discountIndex] = inputValue;
                    return updatedDiscounts;
                  });
                }
              }}
            />
            <button className="dialog-btn" onClick={handleUpdateDiscount}>Save</button>
            <button className="dialog-btn" onClick={handleCloseDialog}>Cancel</button>
            </div>
            )}
            {orderedItems.length !== 0 && (
              <button onClick={() => PurchaseOrder()} >Purchase Order</button>
            )}
            <div className="sales-summary-report-button-container">
              <Link to="/sales-summary-report">
              <button className="sales-summary-report-button" >Sales Summary Report</button>
              </Link>
          </div>
      </div>
      <div>
      </div>
    </div>
    </>
  );
};

export default CashierMain;
