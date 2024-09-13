package com.priceq.services;

import com.priceq.models.Item;
import com.priceq.models.Review;
import com.priceq.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository repository;

    @Autowired
    private ItemService itemService;

    public Review save(Review review) {
        review.setCreatedAt(LocalDate.now());
        return repository.save(review);
    }

    public boolean delete(String id){
        repository.deleteById(id);
        return true;
    }

    public boolean update(String id, Review updatedItem){
        Review existingItem = repository.findById(id).orElse(null);
        if (existingItem == null) {
            return false;
        } else {
            if(updatedItem.getItemID() != null)
                existingItem.setItemID(updatedItem.getItemID());
            if(updatedItem.getDescription() != null)
                existingItem.setDescription(updatedItem.getDescription());
            if(updatedItem.getRating() != 0)
                existingItem.setRating(updatedItem.getRating());
            existingItem.setCreatedAt(LocalDate.now());
            repository.save(existingItem);
            return true;
        }
    }

    public List<Review> getAll(){
        List<Review> reviews = repository.findAll();
        for (Review review : reviews){
            Item item = itemService.getOne(review.getItemID()).orElse(null);
            review.setItem(item);
        }
        return reviews;
    }

    public Optional<Review> getOne(String id) {
        return repository.findById(id);
    }

    public List<Review> getNewestRows(){
        List<Review> reviews = repository.findTop8ByOrderByCreatedAtDesc();
        for (Review review : reviews){
            Item item = itemService.getOne(review.getItemID()).orElse(null);
            review.setItem(item);
        }
        return reviews;
    }

    public List<Review> getTop5ReviewsByRating() {
        return repository.findTop5ByOrderByRatingDesc();
    }

    public Map<Float, Long> getItemCountByRating() {
        List<Review> reviews = repository.findAll();
        return reviews.stream()
                .collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));
    }
}
