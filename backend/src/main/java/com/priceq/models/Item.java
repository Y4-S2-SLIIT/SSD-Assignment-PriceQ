package com.priceq.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "Item")
public class Item {

    @Id
    private String id;
    private String itemCode;
    private String name;
    private String barcode;
    private String description;
    private String brand;
    private String color;
    private String type;
    private float cost;
    private float msrp;
    private float hsrp;
    private float retailPrice;
    private int quantity;
    private String image;
}
