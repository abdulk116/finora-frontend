# Finora Frontend

Frontend application for **Finora**, a personal finance management application for tracking loans, EMIs, expenses, income, accounts, and financial insights.

Built with **React 19, Vite, Material UI, Redux Toolkit, and Axios**.

---

## 🚀 Tech Stack

* **React 19**
* **Vite**
* **Material UI (MUI)**
* **Redux Toolkit**
* **React Redux**
* **React Router**
* **Redux Persist**
* **Axios**
* **Emotion**
* **JavaScript / JSX**

---

## 📁 Project Structure

```text
finora-frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── store/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

> The actual project structure may vary as the application continues to evolve.

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/finora-frontend.git
```

Move into the project directory:

```bash
cd finora-frontend
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root.

### Development

```env
VITE_API_URL=http://localhost:5000
```

### Production

For the deployed Finora backend:

```env
VITE_API_URL=https://your-finora-backend.onrender.com
```

### `.env.example`

The repository should contain:

```env
VITE_API_URL=
```

### ⚠️ Important

Never commit `.env` to GitHub.

Only `.env.example` should be committed.

---

## ▶️ Development

Start the Vite development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

The generated production files will be available inside:

```text
dist/
```

---

## 🔍 Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

---

## 🧹 Lint

Run ESLint:

```bash
npm run lint
```

---

## 🌐 API Configuration

The frontend communicates with the Finora Express backend through Axios.

The API URL is configured using the Vite environment variable:

```env
VITE_API_URL=
```

Example Axios configuration:

```js
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export default api;
```

API requests can then be made using:

```js
api.get("/loans");
```

```js
api.post("/loans", data);
```

```js
api.get("/expenses");
```

This keeps the API URL configurable between development and production environments.

---

## 🔐 Authentication

Finora uses JWT-based authentication.

Authentication state is managed using:

* Redux Toolkit
* React Redux
* Redux Persist

Protected API requests use the authentication token when required.

Example:

```http
Authorization: Bearer <token>
```

---

## 🧩 Main Features

### Authentication

* User registration
* User login
* JWT authentication
* Persistent authentication state
* Logout

### Loan Management

* Create loans
* View loans
* Edit loans
* Delete loans
* Loan status
* Outstanding balance
* EMI tracking
* Payment tracking

### Expense Management

* Add expenses
* View expenses
* Edit expenses
* Delete expenses
* Expense categories
* Expense tracking

### Planned Features

* Income management
* Bank accounts
* Cash and wallet accounts
* Credit card tracking
* Dashboard analytics
* Financial reports
* Notifications
* AI financial insights

---

## 🚀 Deployment

The Finora frontend can be deployed using **Vercel**.

### Vercel Configuration

**Framework**

```text
Vite
```

**Build Command**

```bash
npm run build
```

**Output Directory**

```text
dist
```

**Install Command**

```bash
npm install
```

### Environment Variable

Add the following environment variable in Vercel:

```text
VITE_API_URL
```

Example:

```text
https://your-finora-backend.onrender.com
```

---

## 🔗 Application Architecture

```text
┌──────────────────────────┐
│       Finora Frontend    │
│                          │
│ React + Vite + MUI       │
│ Redux Toolkit            │
└────────────┬─────────────┘
             │
             │ HTTPS / REST API
             ▼
┌──────────────────────────┐
│       Finora Backend     │
│                          │
│ Node.js + Express        │
│ JWT Authentication       │
└────────────┬─────────────┘
             │
             │ Mongoose
             ▼
┌──────────────────────────┐
│      MongoDB Atlas       │
│                          │
│       Finora DB          │
└──────────────────────────┘
```

---

## 🧪 API Testing

The backend API can be tested using:

* Postman
* Thunder Client
* Insomnia
* Finora frontend

Backend health check:

```http
GET /
```

Expected response:

```json
{
  "success": true,
  "message": "Finora API is running..."
}
```

---

## 📦 Deployment Stack

| Layer            | Technology        |
| ---------------- | ----------------- |
| Frontend         | React + Vite      |
| UI               | Material UI       |
| State Management | Redux Toolkit     |
| API Client       | Axios             |
| Backend          | Node.js + Express |
| Database         | MongoDB Atlas     |
| Frontend Hosting | Vercel            |
| Backend Hosting  | Render            |

---

## 📌 Project Status

Finora is currently under active development.

### Completed

* React frontend
* Authentication UI
* Loan management
* Expense management
* Redux state management
* Express backend
* MongoDB integration
* JWT authentication
* Backend deployment

### In Progress

* Production frontend deployment
* Production CORS configuration

### Planned

* EMI management improvements
* Accounts
* Income management
* Dashboard 2.0
* Reports
* Notifications
* AI Financial Insights

---

## 👨‍💻 Author

**Abdul Kareem**

Finora — Personal Finance Management Application

---

## 📄 License

This project is currently intended for personal and development use.
