package com.priceq.repositories;

import com.priceq.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findTop8ByOrderByCreatedAtDesc();

    List<Review> findTop5ByOrderByRatingDesc();
}
