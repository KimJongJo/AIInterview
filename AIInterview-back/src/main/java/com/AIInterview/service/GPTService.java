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
import java.util.Map;

@Service
public class GPTService {


    @Value("${gpt.api.key}")
    private String apiKey;

    @Value("${gpt.api.url}")
    private String API_URL;

    @Value("${gpt.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    // 인터뷰 생성 요청
    public String askInterview(String text) {

        List<Message> messages = List.of(
                new Message("system", "너는 백엔드 개발자 면접관이야 이력서를 보고 개발 관련 질문 6가지 해줘, 한 가지 질문이 끝나면 바로 다음줄에 다음 질문해 줘"),
                new Message("user", text)
        );

        return askGPT(messages);
    }

    // 답변 리뷰 생성 요청
    public String askReview(Map<String, List<String>> content){

        StringBuilder sb = new StringBuilder();
        List<String> questionList = content.get("questionList");
        List<String> answerList = content.get("answerList");

        for(int i = 0; i < questionList.size(); i++){
            sb.append("질문 ").append(questionList.get(i)).append("\n");
            sb.append("답변 ").append(answerList.get(i)).append("\n\n");
        }

//        System.out.println(sb);

        List<Message> messages = List.of(
                new Message("system", "각 질문에 대한 답변을 보고 각각 피드백 해줘"),
                new Message("user", sb.toString()));

        return askGPT(messages);

    }


    public String askGPT(List<Message> messages){

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
