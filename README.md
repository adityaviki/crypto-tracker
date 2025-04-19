# 🪙 Crypto Tracker

A responsive and interactive cryptocurrency tracker built with Next.js and TypeScript. It displays the top 50 coins by market cap using the CoinMarketCap API and offers various features like search, recent views, detailed insights in a popup, and a market cap % change chart.

## 🚀 Features

-   🔍 **Search Functionality** – Quickly filter and find coins by name or symbol.
-   🕒 **Recently Viewed Coins** – Uses localStorage to track and display recently viewed cryptocurrencies.
-   📊 **Popup Details** – Click on a coin to see a popup with detailed information and a chart of market cap % change over the last 90 days.
-   💱 **Currency Selector** – View data in your preferred currency (USD, EUR, etc.).

## 🛠 Tech Stack

-   **Frontend Framework**: [Next.js](https://nextjs.org/)
-   **Language**: TypeScript
-   **UI Components**: Material UI
-   **Charting Library**: Chart.js & react-chartjs-2
-   **Styling**: CSS Modules

## 📦 Getting Started

```bash
git clone https://github.com/your-username/crypto-tracker.git
cd crypto-tracker
npm install
npm run dev
```

## 🛠️ To-Do List

-   [ ] Add column-based filtering to allow users to filter data based on specific values
-   [ ] Implement unit testing using Jest for better reliability and maintainability
-   [ ] Integrate search autocomplete for a smoother user experience
-   [ ] Enable users to mark coins as favorites for quick access
-   [ ] Add coin comparison feature
