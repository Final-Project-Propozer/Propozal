package com.propozal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;
    private final S3Presigner presigner;

    private final String bucketName = "propozal-s3-bukkit";

    // 파일 업로드
    public String uploadFile(String folder, String originalFileName, MultipartFile file) throws IOException {
        // UUID로 파일명 충돌 방지
        String uniqueFileName = UUID.randomUUID() + "_" + originalFileName;
        String keyName = String.format("uploads/%s/%s", folder, uniqueFileName);

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(keyName)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes()));

        return keyName; // S3 객체 Key 반환
    }

    // PreSignedURL 생성(파일 불러오기)
    public String generatePresignedUrl(String folder, String fileName) {
        String keyName = String.format("uploads/%s/%s", folder, fileName);

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(keyName)
                .build();

        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(
                GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(5)) // URL 유효기간
                        .getObjectRequest(getObjectRequest)
                        .build());

        return presignedRequest.url().toString();
    }

    // 파일 삭제
    public void deleteFile(String folder, String fileName) {
        String keyName = String.format("uploads/%s/%s", folder, fileName);
        s3Client.deleteObject(builder -> builder.bucket(bucketName).key(keyName));
    }

    // PDF 파일을 S3에 업로드
    public void uploadPdf(String key, byte[] fileBytes) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType("application/pdf")
                .build();
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileBytes));
    }

    // S3 객체의 유효기간이 있는 URL을 생성
    public String generatePresignedUrl(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofDays(7)) // URL 유효기간 7일
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toString();
    }
}
