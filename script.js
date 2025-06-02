const api_url = "https://api.openai.com/v1/chat/completions";
const api_key = "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";

let prompt = document.getElementById("prompt");
let chatcontainer = document.querySelector(".chat-container");
let submitBtn = document.getElementById("submit");
let imageBtn = document.getElementById("image");
let imageInput = document.getElementById("imageInput");

function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
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

  // Build messages array for API
  let messages = [];

  if (base64Image) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userMessage || "Please analyze this image." },
        { type: "image_url", image_url: { url: base64Image } }
      ],
    });
  } else {
    messages.push({
      role: "user",
      content: userMessage,
    });
  }

  let requestBody = {
    model: "gpt-4o-mini",
    messages: messages,
    max_tokens: 150,
  };

  try {
    let response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${api_key}`,
      },
      body: JSON.stringify(requestBody),
    });
    let data = await response.json();

    if (data.error) {
      text.innerHTML = `⚠️ Error: ${data.error.message}`;
      return;
    }

    let apiResponse = data.choices[0].message.content.trim();
    text.innerHTML = apiResponse;
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
imageInput.addEventListener("change", () => {
  if (imageInput.files.length > 0) {
    let file = imageInput.files[0];
    handleChatResponse(prompt.value.trim(), file);
  }
});

// Listen for Enter key press inside input
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && prompt.value.trim() !== "") {
    handleChatResponse(prompt.value.trim());
  }
});

// Listen for click on up-arrow button
submitBtn.addEventListener("click", () => {
  if (prompt.value.trim() !== "") {
    handleChatResponse(prompt.value.trim());
  }
});
