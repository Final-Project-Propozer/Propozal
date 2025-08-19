package com.propozal.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.propozal.domain.Company;
import com.propozal.domain.EmployeeProfile;
import com.propozal.domain.Estimate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfService {

    private final SpringTemplateEngine templateEngine;

    public byte[] generateEstimatePdf(Map<String, Object> templateModel) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            // PDF용 데이터 전처리
            Map<String, Object> pdfSafeModel = preparePdfSafeData(templateModel);

            Context context = new Context();
            context.setVariables(pdfSafeModel);
            String html = templateEngine.process("estimate-pdf", context);

            log.info("=== PDF용 처리된 데이터 ===");
            log.info("Customer Company: {}", pdfSafeModel.get("customerCompanyName"));
            log.info("Customer Name: {}", pdfSafeModel.get("customerName"));

            // PDF 생성 설정
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();

            // 시스템 폰트를 OpenHTMLtoPDF에 명시적으로 등록
            registerSystemFonts(builder);

            // PDF 페이지 설정
            builder.useDefaultPageSize(210, 297, PdfRendererBuilder.PageSizeUnits.MM); // A4

            // HTML 콘텐츠 설정
            builder.withHtmlContent(html, null);
            builder.toStream(outputStream);
            builder.run();

            byte[] pdfBytes = outputStream.toByteArray();
            log.info("PDF 생성 완료. 크기: {} bytes", pdfBytes.length);

            return pdfBytes;
        } catch (Exception e) {
            log.error("PDF 생성 실패", e);
            throw new RuntimeException("PDF 생성에 실패했습니다.", e);
        }
    }

    private void registerSystemFonts(PdfRendererBuilder builder) {
        try {
            // Windows 시스템 폰트 경로들
            String[] windowsFontPaths = {
                    "C:/Windows/Fonts/malgun.ttf", // 맑은 고딕
                    "C:/Windows/Fonts/malgunbd.ttf", // 맑은 고딕 Bold
                    "C:/Windows/Fonts/malgunsl.ttf", // 맑은 고딕 Semilight
                    "C:/Windows/Fonts/gulim.ttc", // 굴림
                    "C:/Windows/Fonts/batang.ttc", // 바탕
                    "C:/Windows/Fonts/dotum.ttc", // 돋움
                    "C:/Windows/Fonts/NotoSansKR-Regular.ttf" // Noto Sans KR (있는 경우)
            };

            // macOS 시스템 폰트 경로들
            String[] macFontPaths = {
                    "/System/Library/Fonts/AppleSDGothicNeo.ttc",
                    "/Library/Fonts/NanumGothic.ttf",
                    "/System/Library/Fonts/Helvetica.ttc"
            };

            // Linux 시스템 폰트 경로들
            String[] linuxFontPaths = {
                    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
                    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
            };

            String osName = System.getProperty("os.name").toLowerCase();
            String[] fontPaths;

            if (osName.contains("win")) {
                fontPaths = windowsFontPaths;
                log.info("Windows 시스템 감지, Windows 폰트 경로 사용");
            } else if (osName.contains("mac")) {
                fontPaths = macFontPaths;
                log.info("macOS 시스템 감지, macOS 폰트 경로 사용");
            } else {
                fontPaths = linuxFontPaths;
                log.info("Linux 시스템 감지, Linux 폰트 경로 사용");
            }

            boolean fontRegistered = false;

            for (String fontPath : fontPaths) {
                File fontFile = new File(fontPath);
                if (fontFile.exists()) {
                    try {
                        builder.useFont(fontFile, extractFontFamily(fontPath));
                        log.info("폰트 등록 성공: {} -> {}", fontPath, extractFontFamily(fontPath));
                        fontRegistered = true;

                        // 첫 번째 한글 폰트만 등록하고 중단
                        if (isKoreanFont(fontPath)) {
                            break;
                        }
                    } catch (Exception e) {
                        log.warn("폰트 등록 실패: {} - {}", fontPath, e.getMessage());
                    }
                }
            }

            if (!fontRegistered) {
                log.warn("시스템에서 한글 폰트를 찾을 수 없습니다. 기본 폰트를 사용합니다.");

                // 대안: Java에서 제공하는 기본 폰트 사용
                try {
                    Font[] allFonts = GraphicsEnvironment.getLocalGraphicsEnvironment().getAllFonts();
                    for (Font font : allFonts) {
                        if (font.canDisplay('한') && font.canDisplay('글')) {
                            log.info("Java 폰트 발견: {}", font.getFontName());
                            // 이 방법은 직접적으로 등록할 수 없으므로 로그만 남김
                            break;
                        }
                    }
                } catch (Exception e) {
                    log.warn("Java 폰트 확인 실패: {}", e.getMessage());
                }
            }

        } catch (Exception e) {
            log.error("폰트 등록 과정에서 오류 발생: {}", e.getMessage());
        }
    }

    private String extractFontFamily(String fontPath) {
        String fileName = new File(fontPath).getName().toLowerCase();

        if (fileName.contains("malgun")) {
            return "Malgun Gothic";
        } else if (fileName.contains("noto")) {
            return "Noto Sans KR";
        } else if (fileName.contains("gulim")) {
            return "Gulim";
        } else if (fileName.contains("batang")) {
            return "Batang";
        } else if (fileName.contains("dotum")) {
            return "Dotum";
        } else if (fileName.contains("gothic")) {
            return "Gothic";
        } else if (fileName.contains("nanum")) {
            return "Nanum Gothic";
        } else {
            return "Korean Font";
        }
    }

    private boolean isKoreanFont(String fontPath) {
        String fileName = fontPath.toLowerCase();
        return fileName.contains("malgun") ||
                fileName.contains("noto") ||
                fileName.contains("nanum") ||
                fileName.contains("gulim") ||
                fileName.contains("batang") ||
                fileName.contains("dotum");
    }

    private Map<String, Object> preparePdfSafeData(Map<String, Object> originalModel) {
        Map<String, Object> pdfModel = new HashMap<>(originalModel);

        // Estimate 데이터 처리 - 한글 그대로 유지
        Object estimateObj = originalModel.get("estimate");
        if (estimateObj != null) {
            if (estimateObj instanceof Estimate) {
                Estimate estimate = (Estimate) estimateObj;

                pdfModel.put("customerCompanyName",
                        estimate.getCustomerCompanyName() != null ? estimate.getCustomerCompanyName() : "미입력");
                pdfModel.put("customerName", estimate.getCustomerName() != null ? estimate.getCustomerName() : "미입력");
                pdfModel.put("customerPosition",
                        estimate.getCustomerPosition() != null ? estimate.getCustomerPosition() : "");
                pdfModel.put("customerPhone",
                        estimate.getCustomerPhone() != null ? estimate.getCustomerPhone() : "미입력");
                pdfModel.put("customerEmail",
                        estimate.getCustomerEmail() != null ? estimate.getCustomerEmail() : "미입력");
            } else if (estimateObj instanceof Map) {
                Map<String, Object> estimateMap = (Map<String, Object>) estimateObj;
                pdfModel.put("customerCompanyName", getMapValue(estimateMap, "customerCompanyName", "미입력"));
                pdfModel.put("customerName", getMapValue(estimateMap, "customerName", "미입력"));
                pdfModel.put("customerPosition", getMapValue(estimateMap, "customerPosition", ""));
                pdfModel.put("customerPhone", getMapValue(estimateMap, "customerPhone", "미입력"));
                pdfModel.put("customerEmail", getMapValue(estimateMap, "customerEmail", "미입력"));
            }
        }

        // Sender 데이터 처리
        Object senderObj = originalModel.get("sender");
        if (senderObj instanceof EmployeeProfile) {
            EmployeeProfile sender = (EmployeeProfile) senderObj;
            pdfModel.put("senderName", sender.getUser() != null ? sender.getUser().getName() : "영업담당자");
            pdfModel.put("senderPosition", sender.getPosition() != null ? sender.getPosition() : "");
            pdfModel.put("senderPhone", sender.getPhoneNumber() != null ? sender.getPhoneNumber() : "010-1111-2222");
            pdfModel.put("senderEmail", sender.getUser() != null ? sender.getUser().getEmail() : "sales@propozal.com");
        } else {
            pdfModel.put("senderName", "영업담당자");
            pdfModel.put("senderPosition", "");
            pdfModel.put("senderPhone", "010-1111-2222");
            pdfModel.put("senderEmail", "sales@propozal.com");
        }

        // Company 데이터 처리
        Object companyObj = originalModel.get("company");
        if (companyObj instanceof Company) {
            Company company = (Company) companyObj;
            pdfModel.put("senderCompanyName", company.getCompanyName() != null ? company.getCompanyName() : "PropoZal");
        } else {
            pdfModel.put("senderCompanyName", "PropoZal");
        }

        return pdfModel;
    }

    private String getMapValue(Map<String, Object> map, String key, String defaultValue) {
        Object value = map.get(key);
        return value != null ? value.toString() : defaultValue;
    }
}