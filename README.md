# AIstein - Your AI Study Buddy

### This is a NextJS starter in Firebase Studio.
To get started, take a look at src/app/page.tsx.


![AInstein Banner](https://placehold.co/1200x400/232323/00dddd?text=AInstein&font=spacemono)

**AInstein is a full-stack, AI-powered web application designed to be a personal study assistant. It leverages the power of Google's Gemini models to help users understand complex topics, visualize information, and practice concepts in real-time.**

---

## ✨ Key Features

AInstein is more than just a chatbot. It's a suite of powerful, integrated tools designed to enhance the learning process.

*   **💬 Chat Tutor:** Engage in dynamic conversations to get clear explanations on any topic. AInstein can provide notes, summaries, and answer follow-up questions.
*   **🎨 Visualize Concepts:** Don't just read about it—see it! With a single click, generate custom diagrams, illustrations, and visualizations for complex topics discussed in the chat.
*   **🔬 Vision Lab:** Upload images of diagrams, handwritten notes, or math problems directly from your study materials for instant AI analysis and explanation.
*   **🎙️ Live Tutor:** Practice presentations, debate topics, or work on language skills with a real-time, voice-to-voice AI conversation partner.
*   **📚 Session History & Summaries:** All your chat sessions are saved. You can revisit any session and generate a concise summary of the key topics discussed to quickly review what you've learned.
*   **🎨 Customizable & Accessible:** Personalize your experience with profile settings and theme controls (light/dark mode). The app also includes a text-to-speech tool to make content accessible.

---

## 🚀 Tech Stack

AInstein is built with a modern, scalable, and type-safe technology stack.

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **UI Library:** [React](https://react.dev/)
*   **Component Library:** [ShadCN/UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI Backend:** [Genkit (Google's Generative AI Toolkit)](https://firebase.google.com/docs/genkit)
*   **AI Models:** [Google Gemini 2.5 Flash](https://ai.google.dev/) & [Imagen 4.0](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
*   **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore)
*   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **Hosting:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

---

## 🛠️ Getting Started

Follow these instructions to get a local copy of AInstein up and running for development and testing.

### Prerequisites

*   [Node.js](https://nodejs.org/en) (v18 or newer recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   A Firebase project with **Firebase Authentication** (Email/Password provider enabled) and **Cloud Firestore** enabled.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ainstein.git
    cd ainstein
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    *   Create a `.env` file in the root of the project.
    *   Add your Google Generative AI API key to it:
        ```
        GEMINI_API_KEY=your_google_ai_api_key_here
        ```

4.  **Configure Firebase:**
    *   Navigate to `src/firebase/config.ts`.
    *   Replace the placeholder `firebaseConfig` object with the actual configuration object from your Firebase project settings.

5.  **Run the development server:**
    The application requires two concurrent processes to run locally: one for the Next.js frontend and one for the Genkit AI backend.

    *   **In your first terminal, run the Next.js app:**
        ```bash
        npm run dev
        ```
        This will start the frontend on [http://localhost:9002](http://localhost:9002).

    *   **In a second terminal, run the Genkit development server:**
        ```bash
        npm run genkit:watch
        ```
        This starts the AI backend and will watch for any changes you make to the flows or tools.

You should now be able to access the application in your browser and start testing!

---

## 🏗️ System Architecture

AInstein uses a serverless architecture where the Next.js server also hosts the Genkit AI backend. This simplifies deployment and development.

```
+--------------------------------------------------------------------------------------------------+
|                                     User's Browser (Client-Side)                                 |
|--------------------------------------------------------------------------------------------------|
|    +--------------------------+      +---------------------------+      +---------------------+   |
|    |      Next.js/React       |      |    Component Library      |      |   Firebase Client   |   |
|    | (UI Components, Pages)   |----->| (ShadCN UI, Tailwind CSS) |----->|         SDK         |   |
|    | - ChatInterface.tsx      |      +---------------------------+      | - useUser()         |   |
|    | - LiveTutor.tsx          |                                         | - useFirestore()    |   |
|    | - VisionLab.tsx          |                                         | - useCollection()   |   |
|    +--------------------------+                                         +---------------------+   |
+--------------------^---------------------------------------------^-----------------^--------------+
                     | (1) User Actions (HTTP Requests)            | (5) Render UI   | (6) Real-time DB Updates
                     | (e.g., POST to Genkit Flow)                 |     (Props/State) |     (onSnapshot)
                     v                                             v                 v
+--------------------|---------------------------------------------|-----------------|--------------+
|                    |             Firebase App Hosting (Server-Side)              |                 |
|--------------------|-------------------------------------------------------------|-----------------|
|                    v                                                             |                 |
|    +---------------------------+       +------------------------------------+    |                 |
|    |   Next.js Server Runtime  |------>|       Genkit AI Backend            |    |                 |
|    | - Serves React App        |       | ('/src/ai' - loaded via 'use server')|    |                 |
|    | - Executes Genkit Flows   |       |------------------------------------|    |                 |
|    +---------------------------+       | - Flows (answer, summarize, tts)   |    |                 |
|               | (2) Invoke Flow        | - Tools (generateImage)            |    |                 |
|               '----------------------> +-------------^--------------------+    |                 |
|                                                      | (3) API Call            |                 |
|                                                      v                         v (4) DB Operations
|    +--------------------------------+   +--------------------------------+   +-------------------+
|    |    Google AI Platform          |   |       Firebase Services        |   | (Firestore Rules) |
|    |--------------------------------|   |--------------------------------|   | - Security Logic  |
|    | - Gemini 2.5 Flash & Pro       |   | - Authentication (User Auth)   |   +-------------------+
|    | - Imagen 4.0 (Image Gen)       |   | - Firestore (Database)         |
|    | - TTS API (Speech Gen)         |   +--------------------------------+
|    +--------------------------------+                                        |
+--------------------------------------------------------------------------------+
```

### Data Flow Example (User asks a question in Chat)

1.  **User Action (Client):** A user types a question into the `ChatInterface` and hits send.
2.  **Invoke Flow (Client -> Server):** The frontend makes a `POST` request to a Genkit flow (e.g., `answerQuestionsWithContext`) running on the Next.js server. The request includes the question and recent message history for context.
3.  **Call Google AI API (Server -> External):** The Genkit flow constructs a detailed prompt and makes a secure, server-to-server API call to the Google AI API (e.g., Gemini 2.5 Flash).
4.  **Database Operations (Server <-> Firebase):**
    *   **Write:** The user's message and the AI's subsequent response are written to the `chatMessages` collection in Firestore. Every write is validated against **Firestore Security Rules**.
    *   **Read (Real-time):** On the client, the `useCollection` hook has an active `onSnapshot` listener subscribed to the `chatMessages` collection, ensuring the UI is always in sync with the database.
5.  **Render UI (Client):** The server sends back the AI's response, the `ChatInterface` state is updated, and the new message is rendered for the user.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

