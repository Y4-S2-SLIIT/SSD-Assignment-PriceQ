package com.priceq.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "OrderedItem")

public class OrderedItem {

    @Id
    private String id;
    private int orderId;
    private String itemCode;
    private String name;
    private String barcode;
    private String description;
    private int orderedquantity;
    private String brand;
    private float retailPrice; 
    private float discountPrice; 
    private float sellingPrice; 

}
