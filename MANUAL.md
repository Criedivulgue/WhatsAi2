# Application Manual: WhatsAi

## 1. Core Objective

WhatsAi is an intelligent, all-in-one platform for contact management and customer service via chat. Its primary goal is to centralize communication, optimize attendant efficiency, and enrich customer relationships through the strategic use of Artificial Intelligence. The application is designed to be intuitive, powerful, and adaptable to the needs of any brand.

## 2. Core Features

WhatsAi is composed of an integrated ecosystem of features designed to deliver a high-level service and management experience.

### 2.1. Guided Onboarding Flow

To ensure every user maximizes the platform's potential from day one, WhatsAi implements a mandatory and intuitive onboarding process.

-   **Brand Information Collection:** The user inputs the brand name, describes its tone of voice (e.g., "friendly and professional," "formal and direct"), and defines communication rules (e.g., "never offer unapproved discounts").
-   **Attendant Details:** Collects basic attendant information to personalize the experience.
-   **AI Configuration:** Users can set default behaviors for the AI assistant, such as activating automatic conversation summaries, profile enrichment suggestions, and follow-up generation.
-   **Meta Tag Generation:** Based on the brand information, the system automatically generates Open Graph (OG) meta tags for the client-facing chat. This ensures that when the chat link is shared, it displays a professional and informative preview on social media and messaging apps.

### 2.2. Contact Management (CRM)

The heart of WhatsAi is a robust system for organizing, editing, and analyzing contacts.

-   **Unified View:** All contacts are listed in a clean, organized interface with essential information immediately visible.
-   **Import and Add:** Users can import existing contact lists or add new ones manually.
-   **Complete Editing:** Each contact profile can be edited to add/change name, email, phone, status, categories, interests, and internal notes.
-   **Secure Storage:** All contact data and metadata are securely stored in Firestore.

### 2.3. Attendant Chat Interface

The main dashboard provides a chat environment designed for maximum efficiency.

-   **Side-by-Side Layout:** The screen is divided into three panels: chat list, active conversation window, and contact information panel.
-   **Real-Time Updates:** Messages are updated in real-time without needing to reload the page, powered by Firestore's realtime listeners.
-   **AI Control Toggling:** The attendant can activate or deactivate AI support directly within the chat interface, switching between human-only and AI-assisted interaction.
-   **Inline Editing:** The contact panel allows for quick edits without leaving the chat screen, maintaining focus on the conversation.

### 2.4. AI-Powered Chat Summarization

At the end of each significant interaction, the attendant can request the AI to generate a structured summary of the conversation.

-   **Automatic Summarization:** The AI analyzes the dialogue and creates a concise summary of the main points.
-   **Action Item Extraction:** The system identifies and lists tasks or commitments agreed upon during the conversation (e.g., "Send proposal by Friday").
-   **Sentiment Analysis (Optional):** The attendant can enable sentiment evaluation, where the AI provides an assessment of the customer's sentiment (e.g., Positive, Neutral, Negative) based on the language used.
-   **Persistent Memory:** Summaries are saved in the client's history, allowing any future attendant to have immediate context on past interactions.

### 2.5. AI-Driven Profile Enrichment

During or after a conversation, the AI can analyze the content to suggest improvements to the contact's profile.

-   **Interest and Category Suggestions:** Based on the topics discussed, the AI suggests new interests (e.g., "interest in generative AI") or adjusts the contact's category (e.g., from "Lead" to "Qualified Lead").
-   **Opportunity Insights:** The AI identifies potential business opportunities mentioned in the conversation.
-   **Attendant Approval:** Suggestions are presented to the attendant, who can accept them with a click to update the contact's profile or dismiss them.

### 2.6. Intelligent Follow-Up Suggestions

To optimize post-service engagement, the AI generates personalized follow-up suggestions.

-   **Email and WhatsApp Drafts:** Creates drafts of follow-up messages, adapted to the brand's tone and the conversation's context.
-   **Next-Step Recommendations:** Suggests the best subsequent action, such as scheduling a call or sending additional material.
-   **Event Creation:** Proposes creating Google Calendar events with pre-filled titles, descriptions, and guest lists to schedule meetings or reminders.

### 2.7. PWA Chat for Clients

WhatsAi offers a lightweight and optimized chat route for the end client, functioning as a Progressive Web App (PWA).

-   **Simplified Access:** The client accesses via a link and only needs to provide their phone number to start the conversation. No signup or account creation is required. The phone number serves as the temporary session identifier.
-   **Brand Identity:** The interface displays the brand's Open Graph meta tags, reinforcing credibility.
-   **Automatic AI Greeting:** Upon entering the chat, the client is welcomed by a friendly, automatic message generated by the AI, which guides them on how to proceed.
-   **Real-Time and Offline Messaging:** PWA technology ensures a fluid chat experience with support for sending messages even with unstable connections.

## 3. Style Guidelines

The application's visual identity is designed to be clean, modern, and trustworthy.

-   **Primary Color:** Sea Green (`#30D155`) - Used for primary actions, buttons, and active states.
-   **Background Color:** Light Green (`#E5F8E8`) - A soft, unobtrusive color for the main application background.
-   **Accent Color:** Forest Green (`#6ACC7C`) - Used for subtle highlights, secondary information, and interactive elements.
-   **Typography:**
    -   **Body & Headings:** PT Sans is used for all UI text for its warm, modern readability. A clear typographic scale (e.g., 14px, 16px, 20px, 24px) establishes a strong visual hierarchy.
    -   **Code:** Source Code Pro is used for displaying code snippets or technical text.
-   **Iconography:** Minimalist, line-art icons (such as Lucide React) are used to provide clear, intuitive visual cues without cluttering the interface.
-   **Layout:**
    -   The layout is responsive, ensuring a seamless experience on desktop, tablet, and mobile devices.
    -   Consistent spacing and sizing rules (based on a 4px or 8px grid) are applied to maintain a clean and organized structure.

## 4. Technical Architecture

This section provides an overview of the technical foundation of WhatsAi.

### 4.1. Global System Architecture

WhatsAi is built on a modern, serverless stack:

-   **Frontend:** A Next.js application using the App Router, React, and TypeScript.
-   **UI:** Built with ShadCN UI components and styled with Tailwind CSS.
-   **Backend:** Firebase serves as the primary backend, providing Firestore for the database and Firebase Authentication.
-   **AI:** Google's Genkit is used to create and manage AI flows that connect to Large Language Models (LLMs) like Gemini.

### 4.2. Module-Based Structure

The application is organized into logical modules:
-   `src/app/(dashboard)`: Contains all routes and components for the main attendant dashboard (chat, contacts).
-   `src/app/client-chat`: The lightweight PWA for end-clients.
-   `src/components`: Reusable React components (UI elements, chat components, etc.).
-   `src/lib`: Core utilities, type definitions (`types.ts`), and mock data.
-   `src/ai`: Contains all Genkit flows for AI features, separated by functionality (e.g., `generate-chat-summary.ts`).
-   `src/firebase`: Configuration and hooks for connecting to Firebase services.

### 4.3. System Workflows

**Onboarding & Chat Workflow:**
1.  **Onboarding:** A new user completes the multi-step onboarding form. On submission, this data is saved to a `brands` collection in Firestore.
2.  **Dashboard Access:** The user is redirected to the dashboard, where they can access the chat and contacts modules.
3.  **Chat Interaction:** The attendant selects a chat. Messages are fetched from Firestore in real-time. New messages are written directly to Firestore, triggering updates for all participants.
4.  **AI Tools:** The attendant can trigger AI flows (Summarize, Enrich, Follow-Up) from the contact panel. These server-side Genkit flows receive context (like chat history), call the LLM, and return structured JSON data.
5.  **PWA Client:** An end-user accesses the PWA link, enters their phone number, and a new chat document is created in Firestore, linking their phone number to the conversation.

**AI Tool Execution Flow:**
1.  **User Action:** Attendant clicks an AI tool button (e.g., "Generate Summary").
2.  **Client-Side Request:** The client sends the relevant context (chat history, contact data) to a Next.js Server Action.
3.  **Server Action (Genkit Flow):** The Server Action invokes the corresponding Genkit flow (e.g., `generateChatSummary`).
4.  **LLM Call:** The Genkit flow formats the data into a prompt, sends it to the LLM (Gemini), and specifies the desired JSON output schema.
5.  **Structured Response:** The LLM returns a structured JSON object.
6.  **Display & Approval:** The client receives the JSON and displays the suggestions (e.g., new interests, summary text) in the UI. For profile enrichments, "Accept" or "Dismiss" buttons are shown.
7.  **Firestore Update:** If the attendant accepts a suggestion, a client-side function updates the relevant document in Firestore (e.g., adds a new interest to the contact's `interests` array).

### 4.4. Firestore Data Structure

-   `/brands/{brandId}`: Stores information collected during onboarding (brand name, tone, rules).
-   `/users/{userId}`: Stores attendant user data, linked to a brand.
-   `/contacts/{contactId}`: Stores all contact information (name, email, phone, status, categories, interests, notes). Each contact is associated with a `brandId`.
-   `/chats/{chatId}`: Contains metadata for a conversation, including a reference to the `contactId`.
    -   `/chats/{chatId}/messages/{messageId}`: A sub-collection containing individual chat messages (sender, content, timestamp).
    -   `/chats/{chatId}/summaries/{summaryId}`: A sub-collection for storing historical AI-generated summaries.

**Indexes:** Composite indexes are required for querying contacts by status and category simultaneously, and for ordering chats by the timestamp of the last message.

### 4.5. PWA & Real-time Updates

-   **PWA Routing:** The `/client-chat` route is a standalone entry point. It does not require authentication. The phone number provided by the user is used to either find an existing chat or create a new one.
-   **Real-time Pipeline:** Both the attendant dashboard and the PWA client use Firestore's `onSnapshot` listener to subscribe to changes in the `/chats/{chatId}/messages` sub-collection. When a new document is added, Firestore pushes the update to all subscribed clients, resulting in a real-time chat experience.

### 4.6. Security Rules

Firestore security rules are critical for protecting data:
-   Attendants can only read/write data associated with their `brandId`.
-   Contacts, chats, and messages can only be accessed by users belonging to the same brand.
-   PWA clients (unauthenticated) are granted limited write access only to the `/chats/{chatId}/messages` collection for the specific chat session they initiated. They cannot read other chats or access contact data.
-   Rules ensure that data writes conform to the expected schema (e.g., a message must have a `text` and `timestamp` field).
