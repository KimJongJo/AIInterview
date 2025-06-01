package com.AIInterview.controller;


import com.AIInterview.service.FileService;
import com.AIInterview.service.GPTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("upload")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    private FileService fileService;
    private GPTService gptService;


    @Autowired
    public FileController(FileService fileService, GPTService gptService) {
        this.fileService = fileService;
        this.gptService = gptService;
    }



    @PostMapping
    public ResponseEntity<?> loadFile(@RequestParam("file") MultipartFile file){

        // 텍스트 추출
        String text = fileService.getDocument(file);

        if(text == null){
            return null;
        }

        String answer = gptService.askInterview(text);
        Map<String, String> questions = new HashMap<>();
        questions.put("questions", answer);

//        System.out.println(answer);


        return ResponseEntity.ok().body(questions);
    }

}
