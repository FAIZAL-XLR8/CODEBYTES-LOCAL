const axios = require("axios");


const getLanguageId = (language) => {
  const languages = [
    { id: 50, name: "C", aliases: ["c"] },
    { id: 54, name: "C++", aliases: ["cpp", "c++", "cplusplus"] },
    { id: 62, name: "Java", aliases: ["java"] },
    { id: 71, name: "Python", aliases: ["python", "py"] },
    { id: 63, name: "JavaScript", aliases: ["javascript", "js", "node"] },
  ];

 
  const normalizedLang = language.toLowerCase().trim();
  
  const lang = languages.find((ele) => {
    const nameLower = ele.name.toLowerCase();
    const matchesName = nameLower === normalizedLang;
    const matchesAlias = ele.aliases.some(alias => alias.toLowerCase() === normalizedLang);
    return matchesName || matchesAlias;
  });
  
  if (!lang) {
    console.error(' Language not found:', language);
    throw new Error("Unsupported language: " + language);
  }
  
 
  return lang.id;
};

const submitBatch = async (submissions) => {
  try {
    
    
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: { base64_encoded: "false" },
      headers: {
        "x-rapidapi-key": "e27fc56142msh68c93958e1cd391p121ce1jsn1db1fefa708a",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: { submissions },
    };

    const response = await axios.request(options);
   
    return response.data;
    
  } catch (error) {
    console.error(' Error submitting batch to Judge0');
    console.error('Error:', error.message);
    throw new Error('Judge0 batch submission failed: ' + error.message);
  }
};

const submitToken = async (resultToken) => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

 
  
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      const options = {
        method: "GET",
        url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
        params: {
          tokens: resultToken.join(','),
          base64_encoded: "true",  
          fields: "*",
        },
        headers: {
          "x-rapidapi-key": "e27fc56142msh68c93958e1cd391p121ce1jsn1db1fefa708a",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      const results = response.data.submissions;

      const ready = results.every((r) => r.status && r.status.id > 2);
      
      if (ready) {
       
        
        
        const decodeBase64 = (str) => {
          if (!str) return null;
          try {
            return Buffer.from(str, 'base64').toString('utf-8');
          } catch (e) {
            console.error('Failed to decode base64:', e);
            return str;
          }
        };
        
        
        const decodedResults = results.map(result => ({
          ...result,
          stdout: decodeBase64(result.stdout),
          stderr: decodeBase64(result.stderr),
          compile_output: decodeBase64(result.compile_output),
          message: decodeBase64(result.message),
          expected_output: decodeBase64(result.expected_output),
        }));
        
        
        
        return decodedResults;
      }

      const pending = results.filter(r => !r.status || r.status.id <= 2).length;
     
 
      await wait(800);
      
    } catch (error) {
      console.error(' Error fetching submission results');
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw new Error('Failed to fetch results from Judge0: ' + (error.response?.data?.error || error.message));
    }
  }

  throw new Error('Timeout waiting for Judge0 results');
};

module.exports = { getLanguageId, submitBatch, submitToken };