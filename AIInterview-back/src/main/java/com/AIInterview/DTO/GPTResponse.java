package com.AIInterview.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GPTResponse {

    private List<Choice> choices;
    private String id;
    private String model;
    private String object;

    @Getter
    @NoArgsConstructor
    public static class Choice {
        private int index;
        private Message message;
    }
}
