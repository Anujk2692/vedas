package com.vedas;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestExecutionListeners(
        listeners = {DependencyInjectionTestExecutionListener.class, DirtiesContextTestExecutionListener.class}
)
class FullApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthEndpointReportsDatabaseUp() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.database").value("UP"));
    }

    @Test
    void allTabAndSearchEndpointsReturnSeededData() throws Exception {
        mockMvc.perform(get("/api/languages")).andExpect(status().isOk()).andExpect(jsonPath("$[0].code").exists());
        mockMvc.perform(get("/api/vedas?lang=en")).andExpect(status().isOk()).andExpect(jsonPath("$[0].slug").exists());
        mockMvc.perform(get("/api/vedas/gita?lang=en")).andExpect(status().isOk()).andExpect(jsonPath("$.slug").value("gita"));
        mockMvc.perform(get("/api/aartis?lang=hi")).andExpect(status().isOk()).andExpect(jsonPath("$[0].slug").exists());
        mockMvc.perform(get("/api/chalisas?lang=hi")).andExpect(status().isOk()).andExpect(jsonPath("$[0].slug").exists());
        mockMvc.perform(get("/api/bhajans?lang=hi")).andExpect(status().isOk()).andExpect(jsonPath("$[0].slug").exists());
        mockMvc.perform(get("/api/media/all?type=AUDIO&lang=hi")).andExpect(status().isOk());
        mockMvc.perform(get("/api/media/all?type=VIDEO&lang=hi")).andExpect(status().isOk());
        mockMvc.perform(get("/api/search?q=karma&lang=en")).andExpect(status().isOk());
        mockMvc.perform(get("/api/sanatan/hub?lang=hi")).andExpect(status().isOk()).andExpect(jsonPath("$.topics[0].slug").exists());
        mockMvc.perform(get("/api/sanatan/topics?lang=hi")).andExpect(status().isOk()).andExpect(jsonPath("$[0].slug").exists());
        mockMvc.perform(get("/api/sanatan/study-paths?lang=hi")).andExpect(status().isOk()).andExpect(jsonPath("$[0].slug").exists());
        mockMvc.perform(get("/api/sanatan/daily-shlok?lang=hi")).andExpect(status().isOk());
        mockMvc.perform(get("/api/sanatan/gita-of-day?lang=hi")).andExpect(status().isOk());
        mockMvc.perform(get("/api/sanatan/panchang?lang=hi")).andExpect(status().isOk());
        mockMvc.perform(get("/api/sanatan/quizzes?lang=hi")).andExpect(status().isOk());
        mockMvc.perform(get("/api/sanatan/deities?lang=hi")).andExpect(status().isOk());
        mockMvc.perform(get("/api/sanatan/temples?lang=hi")).andExpect(status().isOk());
        mockMvc.perform(get("/api/sanatan/festivals?lang=hi")).andExpect(status().isOk());
    }

    @Test
    void postFeaturesAskGuruAndChildNamesWork() throws Exception {
        mockMvc.perform(post("/api/sanatan/ask")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"What is karma?\",\"lang\":\"en\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").isNotEmpty());

        mockMvc.perform(post("/api/child-names/suggest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fatherName\":\"Anuj\",\"motherName\":\"Priya\",\"deity\":\"Shiva\",\"religion\":\"Hinduism\",\"country\":\"India\",\"language\":\"hi\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.suggestions[0].name").isNotEmpty());
    }
}
