# Application Manual: WhatsAi

## 1. Core Objective

WhatsAi is an intelligent, all-in-one platform for contact management and customer service via chat. Its primary goal is to centralize communication, optimize attendant efficiency, and enrich customer relationships through the strategic use of Artificial Intelligence. The application is designed to be intuitive, powerful, and adaptable to the needs of any brand.

## 2. Core Features

WhatsAi is an integrated ecosystem of features designed to deliver a high-level service and management experience.

### 2.1. Guided Onboarding Flow

To ensure every user maximizes the platform's potential from day one, WhatsAi implements a mandatory and intuitive onboarding process.

-   **Brand Information Collection:** The user inputs the brand name, describes its tone of voice, and defines its communication rules.
-   **AI Behavior Configuration:** The user defines the AI's behavioral framework, including "Hard Rules" (strict prohibitions, e.g., "never offer unapproved discounts") and "Soft Rules" (stylistic guidelines, e.g., "use emojis sparingly"). This configuration governs all AI interactions.
-   **Attendant Details:** Collects basic attendant information to personalize the experience.
-   **AI Feature Activation:** Users can set default behaviors for the AI assistant, such as activating automatic conversation summaries, profile enrichment suggestions, and follow-up generation.
-   **Meta Tag Generation:** Based on the brand information, the system automatically generates Open Graph (OG) meta tags for the client-facing chat, ensuring professional link previews.

### 2.2. Contact Management (CRM)

The heart of WhatsAi is a robust system for organizing and analyzing contacts.

-   **Unified View:** All contacts are listed in a clean interface with essential information immediately visible.
-   **Contact Types, Categories, and Interests:**
    -   **Contact Type:** Defines the core relationship (e.g., `Lead`, `Prospect`, `Client`, `VIP`, `Past Client`). This is critical for the AI to tailor its communication strategy.
    -   **Categories:** Flexible tags for internal segmentation (e.g., `Enterprise`, `Q4-Campaign`, `Support-Tier-1`).
    -   **Interests:** Specific topics the contact has shown interest in (e.g., `Generative AI`, `Cloud Computing`).
-   **Complete Editing:** Each contact profile can be edited to add or modify any of the above attributes, plus name, email, phone, and internal notes.
-   **Secure Storage:** All contact data is securely stored in Firestore.

### 2.3. Attendant Chat Interface

The main dashboard provides a three-panel layout designed for maximum efficiency: chat list, active conversation, and the contact information panel.

-   **Chat States:** Chats are managed through distinct states (`Active`, `Awaiting Return`, `Closed`, `Archived`, `AI-Assisted`), allowing attendants to prioritize and organize their work.
-   **Real-Time Updates:** Messages and chat states are updated in real-time, powered by Firestore.
-   **AI Control Toggling:** The attendant can toggle AI support (`Human-Only` vs. `AI-Assisted`) within the chat. When toggled off, the AI ceases all active participation but continues to listen in the background to maintain context, enabling seamless re-engagement.
-   **Inline Editing:** The contact panel allows for quick profile edits without leaving the chat screen.

### 2.4. AI-Powered Chat Summarization

The AI generates structured summaries by analyzing the **entire contact context**.

-   **Multi-Source Analysis:** The AI uses the current chat history, past conversation summaries, existing contact notes, interests, and categories to create a deeply contextualized summary.
-   **Structured Output:** Summaries include a concise overview, extracted action items, and an optional **sentiment analysis** (Positive, Neutral, Negative) to gauge customer satisfaction.
-   **Persistent Memory:** Summaries are saved to the client's history, providing immediate context for any future attendant.

### 2.5. AI-Driven Profile Enrichment

The AI proactively suggests improvements to a contact's profile based on the conversation.

-   **Contextual Suggestions:** By analyzing the dialogue against the contact's existing profile, the AI suggests new **Interests**, changes to **Categories**, or even updates to the **Contact Type** (e.g., `Lead` → `Prospect`).
-   **Opportunity Insights:** The AI identifies potential business opportunities or up-selling cues.
-   **Attendant Approval:** All suggestions are presented to the attendant for one-click approval or dismissal. Accepted changes update the contact's Firestore document.

### 2.6. Intelligent Follow-Up & Notification System

The AI generates personalized follow-up suggestions and automates scheduling.

-   **Multi-Channel Drafts:** Creates drafts of follow-up emails and WhatsApp messages that adhere to the brand's tone and the conversation's context.
-   **Next-Step Recommendations:** Suggests the best subsequent action, like scheduling a call or sending materials.
-   **Internal Notifications & Reminders:** When an action item is identified (e.g., "Send proposal by Friday"), the system can create an internal notification or reminder for the attendant.
-   **Event Creation:** Proposes creating Google Calendar events with pre-filled details (title, description, guests) to schedule meetings.

### 2.7. PWA Chat for Clients

WhatsAi offers a lightweight Progressive Web App (PWA) for the end client, ensuring a seamless and branded experience.

-   **Simplified Access & Session Control:**
    -   The client accesses via a link and provides only their phone number to start. **No signup or account creation is required.**
    -   The phone number acts as the session identifier. The session remains active for a predefined period (e.g., 24 hours). If the user returns after the session expires, a new chat is initiated to maintain conversation integrity.
    -   A minimal privacy notice is displayed, informing the user that their number is used for identification.
-   **Brand Context Injection:** The chat experience is fully branded. The AI's initial greeting and subsequent responses are dynamically infused with the brand's defined **tone of voice and communication rules**.
-   **Real-Time and Offline Messaging:** PWA technology ensures a fluid experience with support for sending messages even with unstable connections.

## 3. Style Guidelines

The application's visual identity is designed to be clean, modern, and trustworthy.

-   **Primary Color:** Sea Green (`#30D155`) - Used for primary actions, buttons, and active states.
-   **Background Color:** Light Green (`#E5F8E8`) - A soft, unobtrusive color for the main application background.
-   **Accent Color:** Forest Green (`#6ACC7C`) - Used for subtle highlights, secondary information, and interactive elements.
-   **Typography:**
    -   **Body & Headings:** PT Sans is used for all UI text for its warm, modern readability. A clear typographic scale (e.g., 14px, 16px, 20px, 24px) establishes a strong visual hierarchy.
    -   **Code:** Source Code Pro is used for displaying code snippets or technical text.
-   **Iconography:** Minimalist, line-art icons (such as Lucide React) are used to provide clear, intuitive visual cues.
-   **Layout:**
    -   The layout is responsive, ensuring a seamless experience on all devices.
    -   Consistent spacing and sizing rules (based on an 8px grid) are applied to maintain a clean and organized structure.

## 4. Technical Architecture

This section provides an overview of the technical foundation of WhatsAi, structured from foundational layers to feature-specific systems.

### 4.1. System Map (Textual Diagram)

```
[Firebase Backend] <--> [Next.js Server] <--> [React Frontend (Dashboard & PWA)]
       |                      |                             |
   [Firestore]          [Genkit AI Flows]               [ShadCN UI]
       |                      |                             |
[Auth & Sec. Rules]       [Google AI (Gemini)]          [Tailwind CSS]
```

### 4.2. Foundational Layers

-   **Global System Architecture:**
    -   **Frontend:** A Next.js application using the App Router, React, and TypeScript.
    -   **UI:** Built with ShadCN UI components and styled with Tailwind CSS.
    -   **Backend:** Firebase serves as the primary backend, providing Firestore for the database and Firebase Authentication for attendants.
    -   **AI:** Google's Genkit is used to create and manage AI flows that connect to LLMs like Gemini.

-   **Module-Based Structure:**
    -   `src/app/(dashboard)`: Routes and components for the main attendant dashboard.
    -   `src/app/client-chat`: The lightweight PWA for end-clients.
    -   `src/components`: Reusable React components.
    -   `src/lib`: Core utilities, type definitions (`types.ts`), and mock data.
    -   `src/ai`: Genkit flows, separated by functionality (e.g., `generate-chat-summary.ts`).
    -   `src/firebase`: Firebase configuration and hooks.

### 4.3. System Workflows

-   **AI Tool Execution Flow:**
    1.  **User Action:** Attendant clicks an AI tool button (e.g., "Generate Summary").
    2.  **Client-Side Request:** The client sends the **full context** (chat history, contact profile, past summaries) to a Next.js Server Action.
    3.  **Server Action (Genkit Flow):** The Server Action invokes the corresponding Genkit flow.
    4.  **LLM Call:** The flow formats the data into a prompt, including brand rules and tone, and calls the LLM, specifying the desired JSON output schema.
    5.  **AI Logging:** Before returning the response, the system logs the entire transaction: the model used, the flow triggered, the input data hash, the raw JSON output, and a timestamp.
    6.  **Structured Response:** The LLM returns a structured JSON object.
    7.  **Display & Approval:** The client displays the suggestions. If the attendant accepts, a client-side function updates the relevant document in Firestore, and this approval is also logged.

-   **PWA Client & Session Flow:**
    1.  **First Access:** User enters their phone number. A server-side check looks for an active chat session for that number.
    2.  **Session Creation:** If no active session exists, a new chat document is created in Firestore with a `status` of `Active` and a `createdAt` timestamp.
    3.  **Brand Context Injection:** The server retrieves the brand's tone and rules.
    4.  **AI Greeting:** A Genkit flow generates an initial greeting infused with the brand's personality and sends it as the first message.
    5.  **Session Timeout:** The chat session has a Time-to-Live (TTL) policy in Firestore. If inactive for a set period (e.g., 24 hours), its `status` changes to `Closed`. A new interaction from the same number will create a new chat, preserving the context of the old one as history.

### 4.4. Firestore Data Structure

-   `/brands/{brandId}`: Stores onboarding data (brandName, tone, hardRules, softRules).
-   `/users/{userId}`: Stores attendant user data, linked to a `brandId`.
-   `/contacts/{contactId}`:
    -   Fields: `name`, `email`, `phone`, `contactType`, `status`, `brandId`.
    -   Sub-collections: `categories` (array), `interests` (array), `notes` (string).
-   `/chats/{chatId}`:
    -   Fields: `contactId`, `brandId`, `attendantId`, `status` (`Active`, `Awaiting Return`, `Closed`), `lastMessageTimestamp`.
    -   Sub-collections:
        -   `/messages/{messageId}`: (sender, content, timestamp).
        -   `/summaries/{summaryId}`: (summaryText, actionItems, sentiment, createdAt).
-   `/ai_logs/{logId}`:
    -   Fields: `flowName`, `modelUsed`, `inputHash`, `outputJSON`, `userAction` (`accepted`, `dismissed`), `timestamp`.

-   **Indexes:** Composite indexes are required for querying chats by `status` and `lastMessageTimestamp`, and for querying contacts by `brandId` and `contactType`.

### 4.5. Security & Real-time Updates

-   **Security Rules:**
    -   Attendants can only read/write data associated with their `brandId`.
    -   PWA clients (unauthenticated) are granted limited write access only to the `/chats/{chatId}/messages` sub-collection for their specific session. They cannot read other chats or access contact data.
    -   Rules enforce data schema on write.
-   **Real-time Pipeline:** The attendant dashboard and PWA client use Firestore's `onSnapshot` listener to subscribe to changes in the `/chats/{chatId}/messages` collection. New messages trigger real-time updates for all subscribed clients.
