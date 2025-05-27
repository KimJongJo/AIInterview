package com.AIInterview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class GPTRequest {
    private String model;
    private List<Message> messages;

    public GPTRequest(String model, List<Message> messages){
        this.model = model;
        this.messages = messages;

    }
}
