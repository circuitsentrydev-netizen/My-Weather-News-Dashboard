# 🌦️ Weather & News Dashboard

A TypeScript project demonstrating asynchronous JavaScript and TypeScript programming concepts through real-world API integrations. The application retrieves weather information from the **Open-Meteo API** and news data from **DummyJSON**, using Pietermaritzburg, South Africa, as its target location.

This project explores three different approaches to asynchronous execution, demonstrating how callbacks, promises, and async/await handle multiple API requests and process responses.

---

## 🚀 Key Features

* **Location Lookup:** Retrieves geographic coordinates and location information for Pietermaritzburg, South Africa.
* **Weather Integration:** Fetches weather information using the Open-Meteo API.
* **Weather Metrics:** Retrieves temperature, relative humidity, and wind speed.
* **News Integration:** Fetches the latest available posts from DummyJSON.
* **Callback Implementation:** Demonstrates traditional asynchronous programming and nested callbacks.
* **Promise Implementation:** Uses `Promise.all()` and `Promise.race()` to manage concurrent API requests.
* **Async/Await Implementation:** Demonstrates modern asynchronous programming with cleaner and more readable syntax.
* **Performance Comparison:** Compares API execution timing and demonstrates which request completes first.
* **API Integration:** Demonstrates fetching and processing external data using HTTP requests.

---

## 🛠️ Built With

* **Programming Language:** TypeScript
* **Runtime Environment:** Node.js
* **HTTP Requests:** Node.js HTTPS
* **Weather API:** [Open-Meteo](https://open-meteo.com/)
* **News API:** [DummyJSON](https://dummyjson.com/)
* **Package Manager:** npm
* **Configuration:** TypeScript (`tsconfig.json`)

---

## 🔌 API Integrations

### 🌤️ Open-Meteo Weather API

Used to retrieve weather information based on geographic coordinates.

* **API Provider:** [Open-Meteo](https://open-meteo.com/)
* **Data Retrieved:**
  * Temperature
  * Relative humidity
  * Wind speed

### 📰 DummyJSON News API

Used to retrieve sample news-style content through the DummyJSON posts endpoint.

* **API Provider:** [DummyJSON](https://dummyjson.com/)
* **Endpoint:** `https://dummyjson.com/posts`
* **Data Retrieved:**
  * Post titles
  * Post descriptions
  * Post engagement information

---

## 📂 Project Structure

```text
my-weather-news-dashboard/
│
├── src/
│   ├── callbacksVersion.tsx  # Callback implementation
│   ├── promises.tsx          # Promise implementation
│   └── asyncAwait.tsx        # Async/Await implementation
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Asynchronous Programming Approaches

This project contains three implementations that demonstrate different approaches to handling asynchronous operations.

### 1. Callbacks (`callbacksVersion.tsx`)

Demonstrates traditional asynchronous programming using callback functions.

* Handles API responses through callbacks.
* Demonstrates nested asynchronous operations.
* Illustrates the callback hell problem.
* Uses Node.js HTTPS for HTTP requests.

### 2. Promises (`promises.tsx`)

Demonstrates promise-based asynchronous programming.

* Uses `Promise.all()` to execute multiple API requests concurrently.
* Uses `Promise.race()` to identify which API request completes first.
* Improves asynchronous code organisation.
* Demonstrates promise-based error handling.

### 3. Async / Await (`asyncAwait.tsx`)

Demonstrates modern asynchronous programming using async and await.

* Uses `async` functions to manage asynchronous operations.
* Uses `await` to wait for API responses.
* Implements `try...catch` for error handling.
* Provides cleaner and more readable asynchronous code.

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone YOUR_REPOSITORY_URL
   cd my-weather-news-dashboard
   ```

2. **Install project dependencies:**

   ```bash
   npm install
   ```

3. **Run the TypeScript implementation:**

   Use the appropriate script configured in your `package.json`.

   Alternatively, if `tsx` is installed:

   ```bash
   npx tsx src/callbacksVersion.tsx
   ```

   ```bash
   npx tsx src/promises.tsx
   ```

   ```bash
   npx tsx src/asyncAwait.tsx
   ```

---

## 🧪 Testing & Comparison

Run each implementation separately to observe how different asynchronous programming techniques handle API requests.

| Implementation | Main Concept | Key Methods |
|---|---|---|
| Callbacks | Nested callbacks | Callback functions |
| Promises | Concurrent execution | `Promise.all()` |
| Promises | First completed request | `Promise.race()` |
| Async/Await | Modern asynchronous handling | `async` / `await` |

Compare the console output to understand the differences in execution flow, response handling, and code readability.

---

## 🎯 Learning Objectives

This project demonstrates practical understanding of:

* Asynchronous JavaScript and TypeScript.
* Callback functions and callback hell.
* JavaScript Promises.
* Concurrent API requests.
* `Promise.all()` and `Promise.race()`.
* Async/await syntax.
* HTTP requests and external API integration.
* Error handling in
