const api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const api_key = "AIzaSyCexe_rPnjs_d7Dv6UCf0BEWWYShA7X0uE";

async function test() {
  let requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: "Hello!" }]
      }
    ]
  };

  try {
    let response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key,
      },
      body: JSON.stringify(requestBody),
    });
    let data = await response.json();
    console.log("DATA:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("CATCH ERROR:", error);
  }
}
test();
