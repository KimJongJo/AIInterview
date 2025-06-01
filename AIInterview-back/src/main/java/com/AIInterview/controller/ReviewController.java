package com.AIInterview.controller;

import com.AIInterview.service.GPTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("review")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private GPTService gptService;

    @Autowired
    public ReviewController (GPTService gptService){
        this.gptService = gptService;
    }


    @PostMapping
    public ResponseEntity<?> interviewReview(@RequestBody Map<String, List<String>> content){

        String review = gptService.askReview(content);
        Map<String, String> interviewReview = new HashMap<>();
        interviewReview.put("review", review);

        return ResponseEntity.ok().body(interviewReview);

    }
}
