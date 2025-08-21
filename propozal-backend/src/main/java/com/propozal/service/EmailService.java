package com.propozal.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendHtmlMail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("메일 발송 실패: " + e.getMessage(), e);
        }
    }

    public void sendVerificationEmail(String to, String token) {
        String link = "http://localhost:8080/auth/verify-email?token=" + token;
        String htmlBody = "<h2>이메일 인증</h2>"
                + "<p>아래 버튼을 클릭하여 이메일 인증을 완료하세요.</p>"
                + "<a href=\"" + link + "\" "
                + "style='display:inline-block;padding:10px 20px;background-color:#4CAF50;"
                + "color:#fff;text-decoration:none;border-radius:5px;'>이메일 인증하기</a>";

        sendHtmlMail(to, "[Propozal] 이메일 인증 요청", htmlBody);
    }

    public void sendEstimateEmail(String recipientEmail, String subject, Map<String, Object> templateModel) {
        Context context = new Context();
        context.setVariables(templateModel);

        String htmlBody = templateEngine.process("estimate-email", context);

        sendHtmlMail(recipientEmail, subject, htmlBody);
    }

    public void sendPasswordResetMail(String to, String link) {
        String htmlBody = "<h2>비밀번호 재설정</h2>"
                + "<p>아래 버튼을 클릭해 비밀번호를 재설정하세요.</p>"
                + "<a href=\"" + link + "\" "
                + "style='display:inline-block;padding:10px 20px;background-color:#1976D2;"
                + "color:#fff;text-decoration:none;border-radius:5px;'>비밀번호 재설정</a>"
                + "<p>본 링크는 일정 시간 후 만료됩니다.</p>";
        sendHtmlMail(to, "[Propozal] 비밀번호 재설정 안내", htmlBody);
    }
}
