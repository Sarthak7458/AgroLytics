# Project Architecture

## Overview
The application is a **Frontend-Only Prototype** built with **Next.js 16**. It is simulating a crop recommendation system using client-side state and mocked data. Currently, there is no active backend server or database connected.

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI (Radix UI + Lucide React)
- **State Management**: React `useState` (Local State)

## Directory Structure
- **`app/`**: Application routes and layouts.
  - `page.tsx`: Main entry point handling the user flow (Input -> Loading -> Results).
  - `layout.tsx`: Root layout and providers.
- **`components/`**: React components.
  - **Features**: `input-form.tsx`, `results-page.tsx`, `ai-chat-panel.tsx`, `crop-card.tsx`.
  - **UI**: Reusable primitives in `ui/`.
- **`lib/`**: Utilities (currently only class merging for Tailwind).

## Data Flow
1. **User Input**: Collected via `InputForm` (React Hook Form + Zod).
2. **Processing**: Simulated delay in `LoadingScreen`.
3. **Results**:
   - Recommendations are hardcoded in `mockCrops` within `results-page.tsx`.
   - Recommendation logic selects crops based on the selected Season.
4. **AI Chat**: `AIChatPanel` behaves like a chatbot but uses hardcoded responses triggered by specific keywords.

---

# Backend Architecture (Agentic System)

## High-Level Concept
The backend is designed as an **Agentic Decision System** to provide transparent, explainable, and intelligent crop recommendations. Instead of a black-box model, it uses a simpler, judge-friendly architecture where specialized "Agents" collaborate to make a decision.

**Core Philosophy:**
- **Frontend-Driven**: The backend exists solely to serve the UI needs.
- **Explainable**: Every decision (Score, Risk, Recommendation) is traceable to a specific agent's logic.
- **Stateless & Fast**: No database, utilizing in-memory JSON data structures for millisecond-latency responses.

## Directory Structure
```
backend/
├── src/
│   ├── agents/           # Single-responsibility decision agents
│   │   ├── suitability.js
│   │   ├── demand.js
│   │   ├── risk.js
│   │   ├── profit.js
│   │   └── explain.js
│   ├── core/             # Central logic
│   │   └── orchestrator.js
│   ├── data/             # Static JSON Knowledge Base
│   │   ├── crops.json
│   │   ├── prices.json
│   │   └── risks.json
│   ├── api/              # Express Routes
│   │   └── routes.js
│   └── app.js            # Express App & Entry Point
├── package.json
└── server.js
```

## System Components

### 1. API Entry Point (`api/routes.js`)
- Exposes `POST /recommend` and `POST /chat`.
- Validates input (validating types but keeping it loose for hackathon speed).
- Forwards requests to the **Orchestrator**.

### 2. The Orchestrator (`core/orchestrator.js`)
**"The Manager"**
- **Responsibilities**:
    1.  Receives user input (Location, Season, Land, Irrigation).
    2.  **Sequential Agent Chaining**: Calls agents in a specific order to filter and score crops.
        -   `Suitability Agent` -> Filter possible crops.
        -   `Demand Agent` -> Add market scores.
        -   `Risk Agent` -> Add risk profiles.
        -   `Profit Agent` -> Calculate potential ROI.
    3.  **Selection**: Aggregates scores to pick the #1 Winner and runner-ups.
    4.  **Explanation**: Calls the `Explain Agent` to generate human-readable text for the user.
    5.  Returns the final structured JSON.

### 3. Decision Agents (`agents/`)
Each agent performs **one** specific cognitive task, mimicking a real-world expert panel.

| Agent | Responsibility | Logic |
| :--- | :--- | :--- |
| **Suitability Agent** | Can this grow here? | Checks `Season` and `Irrigation` compatibility against `crops.json`. Filters out impossible crops. |
| **Demand Agent** | Is people buying it? | Lookups current market trends in `prices.json`. Assigns a `0.0 - 1.0` Demand Score. |
| **Risk Agent** | Is it safe? | Evaluates weather sensitivity and price volatility from `risks.json`. Assigns Risk Label (Low/Med/High). |
| **Profit Agent** | Will I make money? | Calculates `(Yield * Price) - Cost`. Estimates `Profit/Acre`. |
| **Explain Agent** | Why did we pick this? | Takes raw data (Scores, $ values) and converts it into a "Farmer-Friendly" sentence. |

### 4. Data Layer (`data/*.json`)
- **No Database**: Uses static JSON files as a "Knowledge Base".
- **Easy Modification**: Judges or developers can tweak `crops.json` to see immediate changes in logic without database migrations.

## Data Flow (Request Lifecycle)

1.  **Frontend** sends: `{ season: "Winter", landSize: 2, irrigation: "Tube Well" }`
2.  **Orchestrator** loads all crops from `crops.json`.
3.  **Suitability Agent** filters: Removes "Rice" (needs Summer), keeps "Wheat", "Mustard".
4.  **Demand Agent** scores: "Wheat" (High Demand), "Mustard" (Med Demand).
5.  **Risk Agent** tags: "Wheat" (Low Risk), "Mustard" (Med Risk).
6.  **Profit Agent** calcs: "Wheat" ($400/acre), "Mustard" ($350/acre).
7.  **Orchestrator** ranks: Wheat is #1.
8.  **Explain Agent** writes: "Wheat is recommended because it thrives in Winter and has a steady market price with low risk."
9.  **Response** sent to Frontend.

## Judge-Friendly Narrative
> *"We didn't just build a CRUD app. We built a **Multi-Agent Decision System**. We decomposed the complex problem of agricultural advice into small, deterministic agents—just like a real advisory board (an Agronomist, a Market Analyst, and a Risk Assessor). The Orchestrator synthesizes their unique insights to give the farmer not just a prediction, but a reasoned, safe recommendation."*
