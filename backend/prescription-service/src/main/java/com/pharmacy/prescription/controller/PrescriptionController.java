package com.pharmacy.prescription.controller;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.prescription.dto.PrescriptionDto;
import com.pharmacy.prescription.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}")
public class PrescriptionController {
    
    private final PrescriptionService prescriptionService;
    
    @Value("${file.storage.path:./uploads/prescriptions}")
    private String storagePath;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<PrescriptionDto>> uploadPrescription(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam("file") MultipartFile file) {
        log.info("Prescription upload request from user: {}", userId);
        PrescriptionDto prescription = prescriptionService.uploadPrescription(userId, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Prescription uploaded successfully", prescription));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getMyPrescriptions(
            @RequestHeader("X-User-Id") UUID userId) {
        List<PrescriptionDto> prescriptions = prescriptionService.getPatientPrescriptions(userId);
        return ResponseEntity.ok(ApiResponse.success(prescriptions));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionDto>> getPrescription(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id) {
        PrescriptionDto prescription = prescriptionService.getPrescription(id, userId);
        return ResponseEntity.ok(ApiResponse.success(prescription));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deletePrescription(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id) {
        prescriptionService.deletePrescription(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Prescription deleted successfully", null));
    }
    
    // Record for POST request body
    public record StreamReq(String url) {}
    
    @PostMapping("/file")
    public ResponseEntity<StreamingResponseBody> streamFile(@RequestBody StreamReq req) {
        log.info("========== STREAM FILE REQUEST START ==========");
        log.info("URL received: {}", req.url());
        
        try {
            // Extract filename from URL (handle both /prescriptions/files/filename and full URLs)
            String filename;
            if (req.url().contains("/prescriptions/files/")) {
                filename = req.url().substring(req.url().lastIndexOf("/prescriptions/files/") + "/prescriptions/files/".length());
            } else if (req.url().contains("/files/")) {
                filename = req.url().substring(req.url().lastIndexOf("/files/") + "/files/".length());
            } else {
                // Fallback: extract last part after /
                filename = req.url().substring(req.url().lastIndexOf('/') + 1);
            }
            
            // Remove query string if present
            if (filename.contains("?")) {
                filename = filename.substring(0, filename.indexOf("?"));
            }
            
            log.info("Extracted filename: {}", filename);
            
            // Resolve file path - use same logic as upload
            Path resolvedStoragePath;
            Path testPath = Paths.get(storagePath);
            
            if (testPath.isAbsolute()) {
                resolvedStoragePath = testPath;
            } else {
                Path basePath = Paths.get(System.getProperty("user.dir"));
                resolvedStoragePath = basePath.resolve(storagePath);
            }
            
            Path filePath = resolvedStoragePath.resolve(filename).normalize();
            
            log.info("Resolved file path: {}", filePath);
            log.info("File exists: {}, Readable: {}", Files.exists(filePath), Files.isReadable(filePath));
            
            // Check if file exists
            if (!Files.exists(filePath)) {
                log.error("File not found at: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            if (!Files.isReadable(filePath)) {
                log.error("File not readable: {}", filePath);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            String contentType = determineContentType(filename);
            log.info("Serving file: {} with content type: {}", filename, contentType);
            
            // Create final copies for lambda
            final String finalFilename = filename;
            final Path finalFilePath = filePath;
            
            // Create StreamingResponseBody
            StreamingResponseBody stream = outputStream -> {
                try (InputStream inputStream = Files.newInputStream(finalFilePath)) {
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }
                    outputStream.flush();
                } catch (IOException e) {
                    log.error("Error streaming file: {}", finalFilename, e);
                    throw new RuntimeException("Error streaming file", e);
                }
            };
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(stream);
        } catch (Exception e) {
            log.error("========== EXCEPTION IN streamFile ==========");
            log.error("Error streaming file from URL: {}", req.url(), e);
            log.error("Exception type: {}", e.getClass().getName());
            log.error("Exception message: {}", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } finally {
            log.info("========== STREAM FILE REQUEST END ==========");
        }
    }
    
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<?> getFile(@PathVariable String filename) {
        log.info("========== FILE REQUEST START ==========");
        log.info("Filename received: {}", filename);
        log.info("Storage path config: {}", storagePath);
        
        try {
            log.info("Attempting to serve file: {}", filename);
            
            // Resolve file path - use same logic as upload
            Path resolvedStoragePath;
            Path testPath = Paths.get(storagePath);
            log.info("Test path: {}, isAbsolute: {}", testPath, testPath.isAbsolute());
            
            if (testPath.isAbsolute()) {
                resolvedStoragePath = testPath;
                log.info("Using absolute path: {}", resolvedStoragePath);
            } else {
                // Relative path - resolve from current working directory (same as upload)
                Path basePath = Paths.get(System.getProperty("user.dir"));
                log.info("Current working directory: {}", basePath);
                resolvedStoragePath = basePath.resolve(storagePath);
                log.info("Resolved storage path: {}", resolvedStoragePath);
            }
            
            Path filePath = resolvedStoragePath.resolve(filename).normalize();
            
            log.info("Storage path: {}, Resolved file path: {}", resolvedStoragePath, filePath);
            log.info("File exists: {}, Readable: {}", Files.exists(filePath), Files.isReadable(filePath));
            
            // Check if file exists
            if (!Files.exists(filePath)) {
                log.error("File not found at: {}", filePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("File not found: " + filename, null));
            }
            
            if (!Files.isReadable(filePath)) {
                log.error("File not readable: {}", filePath);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("File not accessible", null));
            }
            
            log.info("Creating UrlResource from path: {}", filePath);
            Resource resource = new UrlResource(filePath.toUri());
            log.info("Resource created, exists: {}, readable: {}", resource.exists(), resource.isReadable());
            
            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);
                log.info("Serving file: {} with content type: {}", filename, contentType);
                // Return file directly, not wrapped in ApiResponse
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                log.warn("Resource check failed for: {}", filePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("File not found: " + filename, null));
            }
        } catch (Exception e) {
            log.error("========== EXCEPTION IN getFile ==========");
            log.error("Error serving file: {}", filename, e);
            log.error("Exception type: {}", e.getClass().getName());
            log.error("Exception message: {}", e.getMessage());
            e.printStackTrace(); // Print full stack trace
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred: " + e.getMessage(), null));
        } finally {
            log.info("========== FILE REQUEST END ==========");
        }
    }
    
    private String determineContentType(String filename) {
        try {
            int lastDotIndex = filename.lastIndexOf(".");
            if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
                return "application/octet-stream";
            }
            String extension = filename.substring(lastDotIndex + 1).toLowerCase();
            return switch (extension) {
                case "pdf" -> "application/pdf";
                case "jpg", "jpeg" -> "image/jpeg";
                case "png" -> "image/png";
                default -> "application/octet-stream";
            };
        } catch (Exception e) {
            log.warn("Error determining content type for: {}", filename, e);
            return "application/octet-stream";
        }
    }
}

