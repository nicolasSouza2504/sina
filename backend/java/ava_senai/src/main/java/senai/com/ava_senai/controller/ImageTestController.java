package senai.com.ava_senai.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.nio.file.Files.copy;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static org.springframework.http.HttpHeaders.CONTENT_DISPOSITION;

@RestController
@RequestMapping("${api.prefix}/img")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ImageTestController {

    // define a location inside the project
    public static final String DIRECTORY = Paths.get("images").toAbsolutePath().toString();

    // Define a method to upload files
    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> multipartFiles) throws IOException {
        List<String> filenames = new ArrayList<>();
        // Ensure the directory exists
        Path dirPath = Paths.get(DIRECTORY);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        for (MultipartFile file : multipartFiles) {
            String filename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            Path fileStorage = dirPath.resolve(filename).toAbsolutePath().normalize();
            copy(file.getInputStream(), fileStorage, REPLACE_EXISTING);
            filenames.add(filename);
        }
        return ResponseEntity.ok().body(filenames);
    }

    // Define a method to download files
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFiles(@PathVariable("filename") String filename) throws IOException {

        System.out.println("getting image"+ filename);
        Path filePath = Paths.get(DIRECTORY).toAbsolutePath().normalize().resolve(filename);
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException(filename + " was not found on the server");
        }
        Resource resource = new UrlResource(filePath.toUri());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("File-Name", filename);
        httpHeaders.add(CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
                .headers(httpHeaders).body(resource);
    }

    // Define a method to list and download all images as resources
    @GetMapping("/list")
    public ResponseEntity<List<ResponseEntity<Resource>>> listAllImagesForDownload() throws IOException {
        Path dirPath = Paths.get(DIRECTORY);

        if (!Files.exists(dirPath)) {
            // Retorna uma lista vazia se o diretório não existir
            return ResponseEntity.ok().body(new ArrayList<>());
        }

        try (Stream<Path> stream = Files.list(dirPath)) {
            // Lista de arquivos como ResponseEntity<Resource> para download
            List<ResponseEntity<Resource>> resources = stream
                    .filter(file -> !Files.isDirectory(file)) // Exclui diretórios
                    .filter(file -> file.getFileName().toString().endsWith(".jpg") ||
                            file.getFileName().toString().endsWith(".png") ||
                            file.getFileName().toString().endsWith(".jpeg")) // Filtra apenas imagens
                    .map(file -> {
                        try {
                            // Converte cada arquivo em um recurso de download
                            Resource resource = new UrlResource(file.toUri());
                            if (resource.exists() && resource.isReadable()) {
                                HttpHeaders headers = new HttpHeaders();
                                headers.add("File-Name", file.getFileName().toString());
                                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name=" + resource.getFilename());

                                return ResponseEntity.ok()
                                        .contentType(MediaType.parseMediaType(Files.probeContentType(file)))
                                        .headers(headers)
                                        .body(resource);
                            } else {
                                throw new FileNotFoundException("Arquivo não encontrado ou não legível: " + file.getFileName().toString());
                            }
                        } catch (IOException e) {
                            throw new RuntimeException("Erro ao processar arquivo: " + file.getFileName().toString(), e);
                        }
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok().body(resources);
        }
    }
}
