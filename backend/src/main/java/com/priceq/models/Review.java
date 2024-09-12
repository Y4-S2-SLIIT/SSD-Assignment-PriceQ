package com.priceq.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "Review")
public class Review {

    @Id
    private String id;
    private String itemID;
    private String description;
    private float rating;
    private LocalDate createdAt;
    private Item item;
}
