# 🌍 Voyage — Travel Planning & Expense Management System

A React.js web application (no JSX — pure `React.createElement`) with AI-powered features
via the Anthropic Claude API.

## Features

| Feature | Description |
|---------|-------------|
| 🔐 Auth | Sign-up & Login with password strength indicator |
| 🗺️ Trips | Create trips with emoji, dates, and budget |
| 🗓 Itinerary | Manual day planner + **AI itinerary generator** |
| 💳 Expenses | Log expenses — **AI auto-categorises** from your note |
| 💰 Budget | **AI budget suggestion** by destination & duration |
| 📊 Reports | Expense breakdown + **AI trip summary narrative** |

## Quick Start

### 1. Get an Anthropic API Key
- Go to https://console.groq.com
- Create an account → API Keys → **Create Key**
- Copy the key (starts with `gsk-...`)



### 2. Set up the API key
```bash
# Copy the example file
cp .env.example .env

# Open .env and replace the placeholder with your real key
REACT_APP_GROQ_KEY=gsk_your-actual-key-here
```

### 3. Install and run
```bash
npm install
npm start
```

The app opens at **http://localhost:3000**

## Project Structure

```
travel-planner/
├── public/
│   └── index.html
├── src/
│   ├── index.js              ← Entry point
│   ├── App.js                ← Root component + state management
│   ├── ai.js                 ← Anthropic Claude API (4 AI features)
│   ├── auth.js               ← Sign-up, login, session management
│   ├── constants.js          ← Colours, categories, sample data
│   ├── utils.js              ← Budget calculation helpers
│   ├── styles.css            ← Global styles & animations
│   └── components/
│       ├── LoginPage.js      ← Login screen
│       ├── SignupPage.js     ← Sign-up screen with password strength
│       ├── Header.js         ← Navigation + user avatar + logout
│       ├── StatCard.js       ← Dashboard stat tile
│       ├── TripCard.js       ← Trip card with budget bar
│       ├── TripDetail.js     ← Trip view (tabs: Itinerary / Expenses)
│       ├── ItineraryTab.js   ← Day-by-day itinerary
│       ├── ExpensesTab.js    ← Expense list + category breakdown
│       ├── ReportsView.js    ← Reports + AI trip summary
│       ├── AddTripModal.js   ← New trip form + AI budget suggestion
│       ├── AddDayModal.js    ← Add day (manual or AI planner)
│       ├── AddExpenseModal.js← Add expense + AI categorisation
│       ├── Modal.js          ← Reusable modal wrapper
│       ├── Field.js          ← Reusable form field
│       └── Progress.js       ← Budget progress bar
├── .env.example              ← API key template (rename to .env)
├── package.json
└── README.md
```

## AI Features

All AI calls go through `src/ai.js` which calls the Anthropic Claude API:

1. **Expense categorisation** — type a note like *"Ramen near Shibuya"* and the AI auto-selects the category (Food) when you click out of the field
2. **Itinerary generation** — enter your destination, number of days, and interests; AI returns a full day-by-day plan
3. **Budget suggestion** — click "AI Suggest Budget" when creating a trip; AI returns a category breakdown with a money-saving tip
4. **Trip summary** — click "Generate AI Trip Summary" on the Reports page; AI writes a 2–3 sentence narrative about your trip

## Stopping the app

Press `Ctrl + C` in the terminal.
