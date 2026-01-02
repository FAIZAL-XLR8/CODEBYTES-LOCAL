const {GoogleGenAI} = require ("@google/genai")

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

 const chatWithAI = async (req, res) => {
  try {
    const { message, systemPrompt } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
module.exports = chatWithAI;
