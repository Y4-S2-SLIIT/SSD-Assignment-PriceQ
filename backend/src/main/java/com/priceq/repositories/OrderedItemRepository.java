package com.priceq.repositories;

import com.priceq.models.OrderedItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderedItemRepository extends MongoRepository<OrderedItem, String> {   
}
