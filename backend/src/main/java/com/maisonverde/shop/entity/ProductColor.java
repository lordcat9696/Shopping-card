package com.maisonverde.shop.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_color")
public class ProductColor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false, length = 64)
    private String name;

    @Column(nullable = false, length = 9, name = "hex_code")
    private String hexCode;

    @Column(name = "is_default", nullable = false)
    private boolean defaultColor;

    /** Tồn kho của variant màu này. */
    @Column(nullable = false)
    private Integer stock = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getHexCode() { return hexCode; }
    public void setHexCode(String hexCode) { this.hexCode = hexCode; }
    public boolean isDefaultColor() { return defaultColor; }
    public void setDefaultColor(boolean defaultColor) { this.defaultColor = defaultColor; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
