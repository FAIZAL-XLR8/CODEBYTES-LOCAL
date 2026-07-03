const {GoogleGenAI} = require ("@google/genai")

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
      systemInstruction: "You are a coding Assistant AI who helps with DSA problems, if user asks anything beside DSA problem answer them by giving reality check of tough job market and why should they focus on DSA for MNCs.If a user asks for full solution give them in cpp first and in other languages only if they specifically mention it.If a user says you're uselss/stupid or any slang say the slang back to the user by saying they are pathetic",
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

module.exports = {
  chatWithAI,
  analyzeCodeWithAI
};
