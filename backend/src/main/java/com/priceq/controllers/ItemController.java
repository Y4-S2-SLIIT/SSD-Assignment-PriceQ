package com.priceq.controllers;

import com.priceq.models.Item;
import com.priceq.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(value = "*")
@RestController
@RequestMapping("/item")
public class ItemController {

    @Autowired
    private ItemService service;

    @PostMapping("/")
    public ResponseEntity<Item> save(@RequestBody Item body){
        Item responseBody = service.save(body);

        if(responseBody == body) {
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Item());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> update(@PathVariable String id , @RequestBody Item body){
        boolean response = service.update(id , body);

        if(response) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(body);
        }else{
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(body);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Item> delete(@PathVariable String id){
        boolean response = service.delete(id);

        if(response){
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new Item());
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Item());
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<Item>> getAll(){
        List<Item> dataSet = service.getAll();

        if(!dataSet.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(dataSet);
        }else{
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Item>> getOne(@PathVariable String id){
        Optional<Item> data = service.getOne(id);

        if(data.isPresent()){
            return ResponseEntity.status(HttpStatus.OK).body(data);
        }else{
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }
    }

    @GetMapping("/paged/")
    public ResponseEntity<Page<Item>> getPagedItems(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        Page<Item> pagedItems = service.getPaginatedItems(page, size);

        if(!pagedItems.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(pagedItems);
        }
        else{
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }
    }

    @GetMapping("/count-by-brand")
    public Map<String, Long> getItemCountByBrand() {
        return service.countItemsByBrand();
    }

    @GetMapping("/count-by-color")
    public Map<String, Long> getNumberOfItemsByColor() {
        return service.getNumberOfItemsByColor();
    }

    @GetMapping("/count-by-type")
    public Map<String, Long> getCountByType() {
        return service.getCountByType();
    }
}
