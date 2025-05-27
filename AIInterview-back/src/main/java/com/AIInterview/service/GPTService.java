package com.AIInterview.service;

import com.AIInterview.DTO.GPTRequest;
import com.AIInterview.DTO.GPTResponse;
import com.AIInterview.DTO.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class GPTService {


    @Value("${gpt.api.key}")
    private String apiKey;

    @Value("${gpt.api.url}")
    private String API_URL;

    @Value("${gpt.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String askGPT(String text) {

        List<Message> messages = List.of(
                new Message("system", "너는 백엔드 개발자 면접관이야. 여기 이력서를 참고해서 질문 5가지만 해줘."),
                new Message("user", text)
        );

        // 1. 요청 DTO 생성
        GPTRequest request = new GPTRequest(model, messages);

        // 2. 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<GPTRequest> entity = new HttpEntity<>(request, headers);

        try{
            // 3. 요청 실행
            ResponseEntity<GPTResponse> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.POST,
                    entity,
                    GPTResponse.class
            );
            // 4. 결과 파싱
            if(response.getStatusCode().is2xxSuccessful()) {
                GPTResponse gptResponse = response.getBody();
                return gptResponse.getChoices().get(0).getMessage().getContent();
            }else {
                throw new RuntimeException("OpenAI 응답 오류 : " + response.getStatusCode());
            }


        } catch(HttpStatusCodeException e){
            System.err.println("HTTP 오류 : " + e.getStatusCode());
            System.err.println("응답 바디 : " + e.getResponseBodyAsString());
            throw new RuntimeException("OpenAI 호출 실패", e);
        } catch(Exception e){
            System.err.println("기타 예외 : " + e.getMessage());
            throw new RuntimeException("GPT 호출 중 오류 발생", e);



        }



    }
}
