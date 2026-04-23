package com.maisonverde.shop.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_item")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "color_name", nullable = false, length = 64)
    private String colorName;

    @Column(nullable = false)
    private int quantity;

    /** Price snapshot in cents — captures sale price at the time of adding. */
    @Column(name = "price_snapshot", nullable = false)
    private int priceSnapshot;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public String getColorName() { return colorName; }
    public void setColorName(String colorName) { this.colorName = colorName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public int getPriceSnapshot() { return priceSnapshot; }
    public void setPriceSnapshot(int priceSnapshot) { this.priceSnapshot = priceSnapshot; }
}
