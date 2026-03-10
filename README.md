# 🤖 ChatBot AI with Image Input

> A modern, elegant, and secure AI chatbot powered by Google's Gemini 2.5 Flash API, featuring a premium glassmorphism interface and seamless text/image multi-modal capabilities. 

![UI Demo](./Image/UI-Preview.png) <!-- Update with an actual preview image path if you have one! -->

## ✨ Features

- **🧠 Advanced AI Engine:** Powered by Google's cutting-edge Gemini 2.5 Flash model for fast, intelligent responses.
- **🖼️ Multi-modal Input:** Ask questions with just text, or upload an image and ask the AI to analyze it!
- **📸 Image Staging:** See a preview of your selected image right above the input box before you send it.
- **💎 Premium Glassmorphism UI:** A sleek, modern dark-mode aesthetic with frosted glass effects, smooth gradients, and subtle animations. 
- **📝 Markdown Support:** AI responses featuring bolding, lists, and code blocks are rendered beautifully via `marked.js`.
- **⚡ Secure Serverless Backend:** API keys are kept safe and hidden from the frontend using a Vercel Serverless Function (`/api/chat`).
- **💻 Local Dev Fallback:** Smart auto-fallback mechanism allows you to test the app locally without needing to spin up the Vercel CLI!

## 🚀 Tech Stack

- **Frontend:** HTML5, Vanilla CSS3 (Glassmorphism), Vanilla JavaScript, `marked.js`
- **Backend:** Node.js (Vercel Serverless Functions)
- **AI API:** Google Generative AI (Gemini)

## 🛠️ Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ChatBotAi.git
   cd ChatBotAi
   ```

2. **Run Locally:**
   Because of the built-in local fallback, you can run this right out of the box using any local server!
   * Using Python: `python -m http.server 8000`
   * Using VS Code: Click "Go Live" with the LiveServer extension.

3. **Open in Browser:**
   Navigate to `http://localhost:8000` (or whatever port your server provides).

## 🌐 Deploying to Vercel (Production)

To deploy this securely so your API key isn't exposed to the public:

1. Create a free account on [Vercel](https://vercel.com/).
2. Push your code to a GitHub repository.
3. Import your project into Vercel.
4. Add your Gemini API Key in the **Environment Variables** section:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `your_actual_api_key_here`
5. Deploy! Vercel will automatically host the frontend and convert `/api/chat.js` into a secure serverless endpoint.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/ChatBotAi/issues).

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
