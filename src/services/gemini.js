import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the specific key provided by the user
const API_KEY = "AIzaSyCJkG2owhEaBYciVlWYCrk6JBExjN8Djlw";

export const analyzeNote = async (noteContent) => {
      
      Output Format(JSON):
    {
        "summary": "Brief summary of the note (max 2 sentences)",
            "keyPoints": ["Point 1", "Point 2", "Point 3"],
                "suggestion": "One actionable suggestion or related idea"
    }
      
      Return ONLY the JSON.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json / g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonString);
} catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
}
};
