package com.maisonverde.shop.service;

import com.maisonverde.shop.common.NotFoundException;
import com.maisonverde.shop.dto.InventoryItemDto;
import com.maisonverde.shop.entity.ProductColor;
import com.maisonverde.shop.repository.ProductColorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminInventoryService {

    private final ProductColorRepository colors;

    public AdminInventoryService(ProductColorRepository colors) {
        this.colors = colors;
    }

    @Transactional(readOnly = true)
    public List<InventoryItemDto> list() {
        return colors.findAllByOrderByProduct_NameAscNameAsc().stream()
                .map(InventoryItemDto::from).toList();
    }

    @Transactional
    public InventoryItemDto updateStock(Long colorId, int newStock) {
        ProductColor c = colors.findById(colorId)
                .orElseThrow(() -> new NotFoundException("Color variant not found: " + colorId));
        c.setStock(newStock);
        return InventoryItemDto.from(colors.save(c));
    }
}
