export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, base64Image } = req.body;

  let parts = [];
  
  if (messages && messages.length > 0) {
    parts.push({ text: messages[0].content });
  }

  if (base64Image) {
    const splitData = base64Image.split(',');
    if (splitData.length > 1) {
      const mimeMatch = splitData[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const rawBase64 = splitData[1];
      
      parts.push({
        inlineData: {
          data: rawBase64,
          mimeType: mimeType
        }
      });
    }
  }

  if (parts.length === 0) {
    parts.push({ text: "Please analyze this image." });
  }

  let requestBody = {
    contents: [
      {
        role: "user",
        parts: parts
      }
    ]
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: "API key is not configured on the server." } });
  }

  const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  try {
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(response.status).json({ error: data.error });
    }

    const apiResponse = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: apiResponse });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return res.status(500).json({ error: { message: "Internal server error." } });
  }
}
