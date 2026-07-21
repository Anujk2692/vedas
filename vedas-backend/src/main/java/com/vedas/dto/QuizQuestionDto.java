package com.vedas.dto;

import java.util.List;

public class QuizQuestionDto {
    private String id;
    private String prompt;
    private List<String> options;
    private int correctIndex;
    private String explanation;
    private String scriptureRef;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public int getCorrectIndex() { return correctIndex; }
    public void setCorrectIndex(int correctIndex) { this.correctIndex = correctIndex; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public String getScriptureRef() { return scriptureRef; }
    public void setScriptureRef(String scriptureRef) { this.scriptureRef = scriptureRef; }
}
