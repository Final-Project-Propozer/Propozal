package com.propozal.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.propozal.domain.Estimate;
import com.propozal.dto.admin.EstimateAdminDto;
import com.propozal.dto.admin.EstimateAdminSearchDto;
import com.propozal.repository.EstimateAdminRepository;

import lombok.RequiredArgsConstructor;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EstimateAdminService {

    private final EstimateAdminRepository estimateRepository;

    // 견적서 전체 조회
    @Transactional(readOnly = true)
    public Page<EstimateAdminDto> getAllEstimates(Pageable pageable) {
        Page<Estimate> estimates = estimateRepository.findAll(pageable);
        return estimates.map(this::convertToDto);
    }

    // 견적서 검색
    @Transactional(readOnly = true)
    public Page<EstimateAdminDto> searchEstimates(EstimateAdminSearchDto searchDto) {
        Page<Estimate> estimates = estimateRepository.searchEstimates(
                searchDto.getStartDate(),
                searchDto.getEndDate(),
                searchDto.getUserId(),
                searchDto.getCustomerName(),
                searchDto.getCustomerCompanyName(),
                searchDto.getPageable()
        );
        return estimates.map(this::convertToDto);
    }

    // 견적서 단일 조회
    @Transactional(readOnly = true)
    public EstimateAdminDto getEstimate(Long id) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 견적서를 찾을 수 없습니다"));
        return convertToDto(estimate);
    }

    // 견적서 삭제
    public void deleteEstimate(Long id) {
        if (!estimateRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 견적서를 찾을 수 없습니다");
        }
        estimateRepository.deleteById(id);
    }

    private EstimateAdminDto convertToDto(Estimate estimate) {
        return EstimateAdminDto.builder()
                .id(estimate.getId())
                .userId(estimate.getUserId())
                .customerName(estimate.getCustomerName())
                .customerEmail(estimate.getCustomerEmail())
                .customerPhone(estimate.getCustomerPhone())
                .customerCompanyName(estimate.getCustomerCompanyName())
                .customerPosition(estimate.getCustomerPosition())
                .totalAmount(estimate.getTotalAmount())
                .vatIncluded(estimate.isVatIncluded())
                .specialTerms(estimate.getSpecialTerms())
                .dealStatus(estimate.getDealStatus())
                .expirationDate(estimate.getExpirationDate())
                .createdAt(estimate.getCreatedAt())
                .updatedAt(estimate.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream generateEstimatePdf(Long id) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 견적서를 찾을 수 없습니다"));

        try {
            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);

            document.open();

            // 제목
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD);
            Paragraph title = new Paragraph("견적서", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(Chunk.NEWLINE);

            // 견적서 정보 테이블
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // 헤더 폰트
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font valueFont = new Font(Font.FontFamily.HELVETICA, 12);

            // 견적서 정보 추가
            addTableRow(table, "견적서 번호", estimate.getId().toString(), headerFont, valueFont);
            addTableRow(table, "고객명", estimate.getCustomerName(), headerFont, valueFont);
            addTableRow(table, "고객 회사명", estimate.getCustomerCompanyName(), headerFont, valueFont);
            addTableRow(table, "고객 이메일", estimate.getCustomerEmail(), headerFont, valueFont);
            addTableRow(table, "고객 연락처", estimate.getCustomerPhone(), headerFont, valueFont);
            addTableRow(table, "고객 직위", estimate.getCustomerPosition(), headerFont, valueFont);
            addTableRow(table, "총 금액", "₩" + estimate.getTotalAmount().toPlainString(), headerFont, valueFont);
            addTableRow(table, "VAT 포함", estimate.isVatIncluded() ? "포함" : "미포함", headerFont, valueFont);
            addTableRow(table, "거래 상태", getDealStatusText(estimate.getDealStatus()), headerFont, valueFont);
            addTableRow(table, "유효 일자", estimate.getExpirationDate() != null ? estimate.getExpirationDate().toString() : "미정", headerFont, valueFont);

            document.add(table);

            // 특약사항
            if (estimate.getSpecialTerms() != null && !estimate.getSpecialTerms().isEmpty()) {
                document.add(Chunk.NEWLINE);
                Paragraph specialTermsTitle = new Paragraph("특약사항", headerFont);
                document.add(specialTermsTitle);

                Paragraph specialTerms = new Paragraph(estimate.getSpecialTerms(), valueFont);
                document.add(specialTerms);
            }

            // 하단 정보
            document.add(Chunk.NEWLINE);
            Paragraph footer = new Paragraph("이 견적서는 시스템에서 자동 생성되었습니다.", valueFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

            return new ByteArrayInputStream(out.toByteArray());

        } catch (DocumentException e) {
            throw new RuntimeException("PDF 생성 중 오류가 발생했습니다", e);
        }
    }

    private void addTableRow(PdfPTable table, String key, String value, Font keyFont, Font valueFont) {
        PdfPCell keyCell = new PdfPCell(new Phrase(key, keyFont));
        keyCell.setBorder(Rectangle.BOX);
        keyCell.setPadding(5);

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "-", valueFont));
        valueCell.setBorder(Rectangle.BOX);
        valueCell.setPadding(5);

        table.addCell(keyCell);
        table.addCell(valueCell);
    }

    private String getDealStatusText(Integer dealStatus) {
        switch (dealStatus) {
            case 0: return "거래 취소";
            case 1: return "거래 대기";
            case 2: return "거래 성사";
            default: return "알 수 없음";
        }
    }
}