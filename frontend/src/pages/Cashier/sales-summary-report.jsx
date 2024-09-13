import React, { useEffect, useState} from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts"
import "../../styles/madusha/salessummaryreport.css";
import Navbar from "../../components/navbar";

const SalesSummaryReport = () => {
    const [allItems, setAllItems] = useState([]);
    const [allOrders, setAllOrders] = useState([]);

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
        
        } catch (error) {
          console.error("Error fetching items:", error);
        }
    };

    const getSalesSummary = () => {
        let total = 0;
        allOrders.forEach((order) => {
            total += order.sellingPrice;
        });
        return total.toFixed(2);
    }

    const getDiscount = () => {
        let total = 0;
        allOrders.forEach((order) => {
            total += (order.discountPrice);
        });
        return total.toFixed(2);
    }

    const getNumberOfOrders = () => {
        return allOrders.length;
    }

    const getNumberOfItems = () => {
        return allItems.length;
    }

    const prepareDataForGraph = () => {
        const itemSalesCount = {};
    
        allOrders.forEach((order) => {
          const itemName = order.name;
    
          if (itemSalesCount[itemName]) {
            itemSalesCount[itemName] += 1;
          } else {
            itemSalesCount[itemName] = 1;
          }
        });
    
        const data = Object.entries(itemSalesCount).map(([itemName, salesCount]) => ({
          itemName,
          salesCount,
        }));
    
        return data;
      };

    return(
        <>
        <Navbar />
            <div className="sales-container">
                <div className="sales-row">
                    <div className="sales-col-6">
                        <div className="sales-card">
                            <div className="sales-card-header">
                                <h4 className="sales-card-title">Sales Summary Report</h4>
                            </div>
                            <div className="sales-graph-card-body">
                            <div className="sales-graph-container">
                                <h5 className="sales-graph-heading">Number of Sales per Item</h5>
                                <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={prepareDataForGraph()}>
                                    <XAxis dataKey="itemName" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="salesCount" fill="#8884d8" name="Sales Count" />
                                </BarChart>
                                </ResponsiveContainer>
                            </div>
                            </div>
                            <div className="sales-card-body">
                                <table className="sales-table table-hover">
                                    <thead>
                                        <tr>
                                            <td>Number of Orders</td>
                                            <td>{getNumberOfOrders()}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Number of Items</td>
                                            <td>{getNumberOfItems()}</td>
                                        </tr>
                                        <tr>
                                            <td>Total sales</td>
                                            <td>${getSalesSummary()}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Discount</td>
                                            <td>${getDiscount()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="sales-card-footer">  
                                <button className="sales-btn btn-primary no-print" onClick={() => window.print()}>Print Sales Summary Report</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SalesSummaryReport;