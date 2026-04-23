package com.maisonverde.shop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/** Địa chỉ giao hàng snapshot — nhúng vào Order, không tách thành bảng riêng. */
@Embeddable
public class ShippingAddress {

    @Column(name = "ship_name", length = 128, nullable = false)
    private String fullName;

    @Column(name = "ship_phone", length = 32, nullable = false)
    private String phone;

    @Column(name = "ship_line1", length = 256, nullable = false)
    private String line1;

    @Column(name = "ship_ward", length = 128)
    private String ward;

    @Column(name = "ship_district", length = 128)
    private String district;

    @Column(name = "ship_city", length = 128, nullable = false)
    private String city;

    @Column(name = "ship_note", length = 512)
    private String note;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getLine1() { return line1; }
    public void setLine1(String line1) { this.line1 = line1; }
    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
