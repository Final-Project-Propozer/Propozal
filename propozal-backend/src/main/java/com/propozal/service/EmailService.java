package com.propozal.service;

import com.propozal.domain.Estimate;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEstimateEmail(Estimate estimate, String recipientEmail) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setTo(recipientEmail);
            helper.setFrom(fromEmail);
            helper.setSubject("[PropoZal] " + estimate.getCustomerCompanyName() + "님께서 요청하신 견적서입니다.");

            Context context = new Context();
            context.setVariable("estimate", estimate);
            String html = templateEngine.process("estimate-email", context);
            helper.setText(html, true);

            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new RuntimeException("이메일 발송에 실패했습니다.", e);
        }
    }
}