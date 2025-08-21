package com.propozal.controller;

import com.propozal.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {

    private final S3Service s3Service;

    // 파일 업로드
    @PostMapping("/upload/{folder}")
    public ResponseEntity<String> upload(
            @PathVariable String folder,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        String key = s3Service.uploadFile(folder, file.getOriginalFilename(), file);
        return ResponseEntity.ok(key);
    }

    // PreSignedURL 생성(파일 불러오기)
    @GetMapping("/download/{folder}/{fileName}")
    public ResponseEntity<String> download(
            @PathVariable String folder,
            @PathVariable String fileName
    ) {
        String url = s3Service.generatePresignedUrl(folder, fileName);
        return ResponseEntity.ok(url);
    }
}
