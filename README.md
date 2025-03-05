# Monetized Weather API Wrapper

## Overview

This example demonstrates how to set up and use the Monetize Weather API Wrapper, which consists of:

- **A backend server** (`index.ts`) using Express, auth-express-middleware, and payment-express-middleware.
- **A frontend client** (`client.js`) that fetches weather data through AuthFetch.

---

## Setup

### Backend Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Start the server:**

```bash
npm run start
```

Your backend server runs at `http://localhost:3000`.

### Frontend Setup

**Serve HTML & bundled JS using live-server or http-server:**

```bash
cd public
npm install -g http-server
http-server
```

Visit `http://localhost:8080` (or the URL provided by your server) in your browser.

---

## Usage

Click the **"Fetch Weather"** button. The application will:

- Call the backend (`/weatherStats`)
- Fetch weather data via AuthFetch/WalletClient
- Display fetched weather data on the page

### Testing

Ensure:
- Your backend server is running.
- Your frontend server is running.

You should see weather data logged in the console and displayed on the page after clicking the button.

---

