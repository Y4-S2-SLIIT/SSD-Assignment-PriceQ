package com.priceq.services;

import com.priceq.models.Item;
import com.priceq.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ItemRepository repository;

    public Item save(Item item) {

        return repository.save(item);
    }

    public boolean delete(String id){
        repository.deleteById(id);
        return true;
    }

    public boolean update(String id, Item updatedTtem){
        Item existingItem = repository.findById(id).orElse(null);

        if (existingItem == null) {
            return false;
        } else {
            if(updatedTtem.getItemCode() != null)
                existingItem.setItemCode(updatedTtem.getItemCode());
            if(updatedTtem.getName() != null)
                existingItem.setName(updatedTtem.getName());
            if(updatedTtem.getBarcode() != null)
                existingItem.setBarcode(updatedTtem.getBarcode());
            if(updatedTtem.getDescription() != null)
                existingItem.setDescription(updatedTtem.getDescription());
            if(updatedTtem.getBrand() != null)
                existingItem.setBrand(updatedTtem.getBrand());
            if(updatedTtem.getColor() != null)
                existingItem.setColor(updatedTtem.getColor());
            if(updatedTtem.getType() != null)
                existingItem.setType(updatedTtem.getType());
            if(updatedTtem.getCost() != 0)
                existingItem.setCost(updatedTtem.getCost());
            if(updatedTtem.getMsrp() != 0)
                existingItem.setMsrp(updatedTtem.getMsrp());
            if(updatedTtem.getHsrp() != 0)
                existingItem.setHsrp(updatedTtem.getHsrp());
            if(updatedTtem.getRetailPrice() != 0)
                existingItem.setRetailPrice(updatedTtem.getRetailPrice());
            if(updatedTtem.getQuantity() != 0)
                existingItem.setQuantity(updatedTtem.getQuantity());
            if(updatedTtem.getImage() != null)
                existingItem.setImage(updatedTtem.getImage());
            repository.save(existingItem);
            return true;
        }
    }

    public List<Item> getAll(){
        return repository.findAll();
    }

    public Page<Item> getPaginatedItems(int page, int size){
        PageRequest pageRequest = PageRequest.of(page , size);
        return repository.findAll(pageRequest);
    }

    public Optional<Item> getOne(String id) {
        return repository.findById(id);
    }

    public Map<String, Long> countItemsByBrand() {
        List<Item> items = repository.findAll();

        return items.stream()
                .collect(Collectors.groupingBy(Item::getBrand, Collectors.counting()));
    }

    public Map<String, Long> getNumberOfItemsByColor() {
        List<Item> items = repository.findAll();

        return items.stream()
                .collect(Collectors.groupingBy(Item::getColor, Collectors.counting()));
    }

    public Map<String, Long> getCountByType() {
        List<Item> items = repository.findAll();
        return items.stream()
                .collect(Collectors.groupingBy(Item::getType, Collectors.counting()));
    }
}
