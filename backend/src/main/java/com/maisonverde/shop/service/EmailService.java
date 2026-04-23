package com.maisonverde.shop.service;

import com.maisonverde.shop.entity.Order;
import com.maisonverde.shop.entity.OrderItem;
import com.maisonverde.shop.entity.OrderStatus;
import com.maisonverde.shop.entity.PaymentMethod;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("HH:mm · dd/MM/yyyy");
    private static final NumberFormat VND = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

    private final JavaMailSender mailSender;
    private final boolean enabled;
    private final String from;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.enabled:false}") boolean enabled,
            @Value("${app.mail.from}") String from
    ) {
        this.mailSender = mailSender;
        this.enabled = enabled;
        this.from = from;
    }

    @Async
    public void sendOrderConfirmation(Order order) {
        String to = order.getUser() == null ? null : order.getUser().getEmail();
        if (to == null) return;
        String subject = "[Maison Verde] Xác nhận đơn hàng " + order.getCode();
        String html = renderOrderConfirmation(order);
        send(to, subject, html);
    }

    @Async
    public void sendOrderStatusUpdate(Order order) {
        String to = order.getUser() == null ? null : order.getUser().getEmail();
        if (to == null) return;
        String subject = "[Maison Verde] Đơn " + order.getCode() + " — " + statusLabel(order.getStatus());
        String html = renderStatusUpdate(order);
        send(to, subject, html);
    }

    private void send(String to, String subject, String html) {
        if (!enabled) {
            // Dev mode: log email thay vì gửi, tránh phải set up SMTP
            log.info("[MAIL disabled] To: {} | Subject: {}\n{}", to, subject, html);
            return;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, StandardCharsets.UTF_8.name());
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(msg);
            log.info("Sent email to {}: {}", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Mail error: {}", e.getMessage(), e);
        }
    }

    // ==================== Templates (inline HTML, không dùng Thymeleaf cho đơn giản) ====================

    private String renderOrderConfirmation(Order order) {
        var a = order.getShippingAddress();
        StringBuilder items = new StringBuilder();
        for (OrderItem it : order.getItems()) {
            items.append("""
                    <tr>
                      <td style="padding:8px 0;border-top:1px solid #E3DCC9;">%s<br/><span style="color:#6B6B6B;font-size:12px">%s × %d</span></td>
                      <td style="padding:8px 0;border-top:1px solid #E3DCC9;text-align:right;font-weight:700">%s</td>
                    </tr>
                    """.formatted(
                    escape(it.getProductName()),
                    escape(it.getColorName()),
                    it.getQuantity(),
                    VND.format(it.getUnitPrice() * it.getQuantity())
            ));
        }

        String bankHint = order.getPaymentMethod() == PaymentMethod.BANK_TRANSFER
                ? """
                <div style="background:#EAE1C7;padding:16px;border-radius:12px;margin-top:16px;font-size:13px;color:#1F3D2F">
                  <strong>Hướng dẫn chuyển khoản</strong><br/>
                  Nội dung chuyển khoản: <strong>%s</strong><br/>
                  Shop sẽ xác nhận đơn ngay khi nhận được tiền.
                </div>
                """.formatted(order.getCode())
                : "";

        return """
                <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#F4EEDE;color:#1A1A1A">
                  <div style="background:#fff;border-radius:16px;padding:32px">
                    <h1 style="font-family:Archivo,Arial,sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-0.01em;color:#1F3D2F;font-size:24px;margin:0 0 8px">
                      Cảm ơn bạn đã đặt hàng!
                    </h1>
                    <p style="color:#6B6B6B;margin:0 0 24px">Mã đơn: <strong style="color:#1F3D2F">%s</strong> · %s</p>

                    <h2 style="font-family:Archivo,Arial,sans-serif;text-transform:uppercase;letter-spacing:0.14em;font-size:12px;color:#1F3D2F;margin:24px 0 8px">Sản phẩm</h2>
                    <table style="width:100%%;border-collapse:collapse;font-size:14px">%s</table>

                    <table style="width:100%%;border-collapse:collapse;font-size:14px;margin-top:16px;border-top:1px solid #E3DCC9;padding-top:16px">
                      <tr><td style="padding:4px 0;color:#6B6B6B">Tạm tính</td><td style="padding:4px 0;text-align:right">%s</td></tr>
                      <tr><td style="padding:4px 0;color:#6B6B6B">Vận chuyển</td><td style="padding:4px 0;text-align:right">%s</td></tr>
                      <tr><td style="padding:8px 0;border-top:1px solid #E3DCC9;font-weight:900;font-family:Archivo,Arial,sans-serif;text-transform:uppercase;letter-spacing:0.1em;font-size:13px">Tổng</td><td style="padding:8px 0;border-top:1px solid #E3DCC9;text-align:right;font-weight:900;font-size:16px">%s</td></tr>
                    </table>

                    <h2 style="font-family:Archivo,Arial,sans-serif;text-transform:uppercase;letter-spacing:0.14em;font-size:12px;color:#1F3D2F;margin:24px 0 8px">Giao đến</h2>
                    <div style="font-size:14px">
                      <strong>%s</strong> · %s<br/>
                      <span style="color:#6B6B6B">%s</span>
                    </div>

                    <h2 style="font-family:Archivo,Arial,sans-serif;text-transform:uppercase;letter-spacing:0.14em;font-size:12px;color:#1F3D2F;margin:24px 0 8px">Thanh toán</h2>
                    <div style="font-size:14px">%s</div>
                    %s

                    <p style="color:#6B6B6B;font-size:12px;margin-top:32px;border-top:1px solid #E3DCC9;padding-top:16px">
                      Maison Verde · Sustainable activewear · maisonverde.local
                    </p>
                  </div>
                </div>
                """.formatted(
                order.getCode(),
                DATE_FMT.format(order.getCreatedAt().atZone(VN_ZONE)),
                items,
                VND.format(order.getSubtotal()),
                VND.format(order.getShippingFee()),
                VND.format(order.getTotal()),
                escape(a.getFullName()),
                escape(a.getPhone()),
                escape(joinAddress(a.getLine1(), a.getWard(), a.getDistrict(), a.getCity())),
                paymentLabel(order.getPaymentMethod()),
                bankHint
        );
    }

    private String renderStatusUpdate(Order order) {
        return """
                <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#F4EEDE;color:#1A1A1A">
                  <div style="background:#fff;border-radius:16px;padding:32px">
                    <h1 style="font-family:Archivo,Arial,sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-0.01em;color:#1F3D2F;font-size:22px;margin:0 0 8px">
                      Đơn hàng được cập nhật
                    </h1>
                    <p style="color:#6B6B6B;margin:0 0 24px">Mã đơn: <strong style="color:#1F3D2F">%s</strong></p>
                    <p style="font-size:16px;margin:0">Trạng thái mới: <strong style="color:#1F3D2F">%s</strong></p>
                    <p style="color:#6B6B6B;font-size:13px;margin-top:24px">Cập nhật lúc %s</p>
                  </div>
                </div>
                """.formatted(
                order.getCode(),
                statusLabel(order.getStatus()),
                DATE_FMT.format(java.time.Instant.now().atZone(VN_ZONE))
        );
    }

    private static String statusLabel(OrderStatus s) {
        return switch (s) {
            case PENDING -> "Chờ xử lý";
            case CONFIRMED -> "Đã xác nhận";
            case SHIPPING -> "Đang giao";
            case DELIVERED -> "Đã giao";
            case CANCELLED -> "Đã huỷ";
        };
    }

    private static String paymentLabel(PaymentMethod m) {
        return switch (m) {
            case COD -> "Thanh toán khi nhận hàng (COD)";
            case BANK_TRANSFER -> "Chuyển khoản ngân hàng";
        };
    }

    private static String joinAddress(String... parts) {
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p == null || p.isBlank()) continue;
            if (sb.length() > 0) sb.append(", ");
            sb.append(p);
        }
        return sb.toString();
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
