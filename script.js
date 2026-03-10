const vercel_api_url = "/api/chat";
const fallback_gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const fallback_api_key = "AIzaSyCexe_rPnjs_d7Dv6UCf0BEWWYShA7X0uE";

let prompt = document.getElementById("prompt");
let chatcontainer = document.querySelector(".chat-container");
let submitBtn = document.getElementById("submit");
let imageBtn = document.getElementById("image");
let imageInput = document.getElementById("imageInput");
let imagePreviewContainer = document.getElementById("image-preview-container");
let stagedImage = document.getElementById("staged-image");
let removeImageBtn = document.getElementById("remove-image-btn");
let currentStagedFile = null;

function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.className = classes;
  div.classList.add("animate-entry");
  return div;
}

// Convert image file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

async function generateResponse(userMessage, aiChatBox, base64Image = null) {
  let text = aiChatBox.querySelector(".ai-chat-area");

  let requestBody = {
    messages: userMessage ? [{ content: userMessage }] : [],
    base64Image: base64Image
  };

  try {
    // Attempt to use the Vercel Serverless Function first (Secure for production)
    let response = await fetch(vercel_api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // If local development (like LiveServer or Python HTTP server), this will fail with 404/405/501
    if (!response.ok && (response.status === 405 || response.status === 404 || response.status === 501)) {
      console.warn("Vercel Serverless Function not found. Falling back to direct Gemini API call for local testing.");
      
      // Rebuild payload for Gemini direct
      let parts = [];
      if (userMessage) parts.push({ text: userMessage });
      if (base64Image) {
        const splitData = base64Image.split(',');
        parts.push({
          inlineData: { data: splitData[1], mimeType: splitData[0].match(/:(.*?);/)[1] }
        });
      }
      if (parts.length === 0) parts.push({ text: "Please analyze this image." });

      const geminiBody = { contents: [{ role: "user", parts: parts }] };

      response = await fetch(fallback_gemini_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": fallback_api_key,
        },
        body: JSON.stringify(geminiBody),
      });

      let data = await response.json();
      if (data.error) {
        text.innerHTML = `⚠️ Error: ${data.error.message}`;
        return;
      }
      
      let apiResponse = data.candidates[0].content.parts[0].text.trim();
      text.innerHTML = marked.parse(apiResponse);
      return; 
    }

    // Process Vercel API Response
    let data = await response.json();

    if (data.error) {
      text.innerHTML = `⚠️ Error: ${data.error.message || "Failed to fetch response."}`;
      return;
    }

    let apiResponse = data.text;
    text.innerHTML = apiResponse ? marked.parse(apiResponse) : "No format response from server.";
  } catch (error) {
    console.error(error);
    text.innerHTML = "⚠️ Error fetching response.";
  } finally {
    chatcontainer.scrollTo({
      top: chatcontainer.scrollHeight,
      behavior: "smooth",
    });
  }
}

async function handleChatResponse(message, imageFile = null) {
  if (!message.trim() && !imageFile) return;

  // Show user message + image if exists
  let userHTML = `
    <img src="./Image/User-Profile.png" width="50" alt="User" />
    <div class="user-chat-area">
      ${message ? message : ""}
      ${imageFile ? `<img src="" class="user-image-preview" alt="User Image" />` : ""}
    </div>`;

  let userChatBox = createChatBox(userHTML, "user-chat-box");
  chatcontainer.appendChild(userChatBox);

  // If image exists, set it as src of img inside user-chat-area
  if (imageFile) {
    let imgTag = userChatBox.querySelector(".user-image-preview");
    let base64 = await fileToBase64(imageFile);
    imgTag.src = base64;
  }

  prompt.value = "";

  // AI chat box with loading
  let aiHTML = `
    <img src="./Image/ai.webp" width="50" alt="AI" />
    <div class="ai-chat-area">
      <img src="./Image/loading.gif" alt="Loading" width="50px" class="load" />
    </div>`;

  let aiChatBox = createChatBox(aiHTML, "ai-chat-box");
  chatcontainer.appendChild(aiChatBox);

  chatcontainer.scrollTo({
    top: chatcontainer.scrollHeight,
    behavior: "smooth",
  });

  let base64Image = null;
  if (imageFile) {
    base64Image = await fileToBase64(imageFile);
  }

  setTimeout(() => {
    generateResponse(message, aiChatBox, base64Image);
  }, 500);
}

// Open file picker on image button click
imageBtn.addEventListener("click", () => {
  imageInput.click();
});

// When user selects an image file
imageInput.addEventListener("change", async () => {
  if (imageInput.files.length > 0) {
    currentStagedFile = imageInput.files[0];
    let base64 = await fileToBase64(currentStagedFile);
    stagedImage.src = base64;
    imagePreviewContainer.style.display = "flex";
  }
});

// Remove staged image
removeImageBtn.addEventListener("click", () => {
  currentStagedFile = null;
  imageInput.value = "";
  imagePreviewContainer.style.display = "none";
  stagedImage.src = "";
});

// Send Chat Functionality
function triggerSend() {
  let userText = prompt.value.trim();
  if (userText !== "" || currentStagedFile) {
    handleChatResponse(userText, currentStagedFile);
    // Cleanup staged image after send
    currentStagedFile = null;
    imageInput.value = "";
    imagePreviewContainer.style.display = "none";
    stagedImage.src = "";
  }
}

// Listen for Enter key press inside input
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    triggerSend();
  }
});

// Listen for click on up-arrow button
submitBtn.addEventListener("click", () => {
  triggerSend();
});
