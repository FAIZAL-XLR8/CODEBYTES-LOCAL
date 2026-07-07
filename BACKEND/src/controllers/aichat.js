const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
    const { message, systemPrompt } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\nUser: " + message }] }
      ],
      config: {
        systemInstruction: "You are a coding Assistant AI who helps with DSA problems, Focus on intuition, control flow, and complexity, if user asks anything beside DSA problem , do not answer them just say I can help only with DSA."

      },
    });

    res.json({
      reply: response.text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
};

const analyzeCodeWithAI = async (req, res) => {
  try {
    const { code, language, problemTitle, problemDescription } = req.body;
    if (!code || code.trim() === "") {
      return res.status(400).json({ error: "Code content is required" });
    }

    const prompt = `
      You are an elite technical interviewer. Analyze the following user code submission.
      
      Problem: ${problemTitle}
      Description: ${problemDescription}
      Language: ${language}
      Code: 
      \n\`\`\`${language}\n${code}\n\`\`\`\n

      Provide structured feedback addressing the following topics in order:
      1. **Complexity Analysis**: Explicitly state the Time Complexity and Space Complexity using Big O notation.
      2. **Variable Naming & Code Cleanliness**: Suggest better variable names or readability improvements if any.
      3. **Alternative Algorithms**: Suggest alternative approaches or optimisations (e.g., if they used O(N^2), explain how to do O(N log N) or O(N)).
      4. **Missed Edge Cases**: Identify edge cases (e.g., empty inputs, negative values, large bounds, duplicates) they might have missed.
      5. **Interview-style Feedback**: An encouraging concluding note on how they did.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    res.json({
      feedback: response.text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Code analysis failed" });
  }
};

const getNextLinesSuggestion = async (req, res) => {
  try {
    const { code, language, problemTitle, problemDescription } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code content is required" });
    }

    const prompt = `
      You are an expert pair-programming tutor. Analyze the user's code for this programming problem:
      
      Problem: ${problemTitle}
      Description: ${problemDescription}
      Language: ${language}
      User's current code:
      \`\`\`${language}
      ${code}
      \`\`\`

      Analyze their logic. 
      If their approach has a bug, or is heading in a wrong direction, correct them.
      If it is correct, suggest the next logical lines.

      Provide exactly:
      1. Rationale line 1 explaining why/how to write the next step.
      2. Rationale line 2 detailing the logic or optimization for this step.
      3. Exactly 4 lines of clean code to inject next.

      Return ONLY a JSON object:
      {
        "rationaleLine1": "Sentence 1 explaining why.",
        "rationaleLine2": "Sentence 2 explaining why.",
        "codeToInject": "Exactly 4 lines of matching code to insert next."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text.trim());
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Code suggestion failed" });
  }
};

const studyAssistantChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // Default assistant system instructions
    const systemInstruction = "You are a helpful DSA coding assistant. Focus on intuition, algorithm design, control flow, and computational complexity.";

    // Generate response using gemini-3.1-flash-lite
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [{ role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction: systemInstruction
      }
    });

    res.json({
      reply: response.text
    });
  } catch (err) {
    console.error("Study assistant controller error:", err);
    res.status(500).json({ error: "Failed to fetch response from study assistant" });
  }
};

module.exports = {
  chatWithAI,
  analyzeCodeWithAI,
  getNextLinesSuggestion,
  studyAssistantChat
};
