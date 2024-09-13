package com.priceq.services;

import com.priceq.models.OrderedItem;
import com.priceq.repositories.OrderedItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderedItemService {
     @Autowired
    private OrderedItemRepository repository;

    public OrderedItem save(OrderedItem item) {
        return repository.save(item);
    }

    public boolean delete(String id){
        repository.deleteById(id);
        return true;
    }

    public boolean update(String id, OrderedItem updatedTtem){
        OrderedItem existingItem = repository.findById(id).orElse(null);

        if (existingItem == null) {
            return false;
        } else {
            existingItem.setOrderId(updatedTtem.getOrderId());
            existingItem.setItemCode(updatedTtem.getItemCode());
            existingItem.setName(updatedTtem.getName());
            existingItem.setBarcode(updatedTtem.getBarcode());
            existingItem.setDescription(updatedTtem.getDescription());
            existingItem.setOrderedquantity(updatedTtem.getOrderedquantity());
            existingItem.setBrand(updatedTtem.getBrand());
            existingItem.setRetailPrice(updatedTtem.getRetailPrice());
            existingItem.setDiscountPrice(updatedTtem.getDiscountPrice());
            existingItem.setSellingPrice(updatedTtem.getSellingPrice());

            repository.save(existingItem);
            return true;
        }
    }

    public List<OrderedItem> getAll(){
        return repository.findAll();
    }

    public Optional<OrderedItem> getOne(String id) {
        return repository.findById(id);
    }
}
