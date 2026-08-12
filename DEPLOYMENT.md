# 🚀 Detailed Deployment Guide

This guide contains step-by-step instructions to deploy your **Gemini RAG Support Bot**.

---

## 📋 Prerequisites
Before you begin, ensure you have:
1.  **GitHub Account**: The code must be pushed to a repository.
2.  **MongoDB Atlas Account**: For the database.
3.  **Google Gemini API Key**: For the AI logic.
4.  **Render Account**: For the Backend (Free tier available).
5.  **Vercel Account**: For the Frontend (Free tier available).

---

## 🛠 Step 1: Prepare the Codebase
(These steps have already been done for you in the latest update, but verify before pushing)

1.  **Backend**: Open `backend/package.json` and ensure `"tsx"` is listed under `"dependencies"` (not `devDependencies`).
2.  **Frontend**: Open `frontend/App.tsx` and ensure `API_URL` uses `import.meta.env.VITE_API_BASE_URL`.
3.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Prepare for deployment"
    git push origin main
    ```

---

## ☁️ Step 2: Set Up MongoDB Atlas (Database)
If you haven't set up a cloud database yet:

1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  **Create a Cluster**: Use the free "M0 Sandbox" tier.
3.  **Create a User**: Go to **Database Access** -> **Add New Database User**.
    - Username: `admin` (or your choice).
    - Password: **Create a strong password and copy it**.
4.  **Allow Network Access**: Go to **Network Access** -> **Add IP Address**.
    - Select **Allow Access From Anywhere** (`0.0.0.0/0`).
    - *Why?* Cloud hosting uses dynamic IPs, so we need to allow all connections.
5.  **Get Connection String**:
    - Go to **Database** -> **Connect** -> **Drivers**.
    - Copy the string (e.g., `mongodb+srv://admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).
    - **Important**: Replace `<password>` with your actual password (remove the `< >`).

---

## 🔙 Step 3: Deploy Backend (Render)

1.  Log in to [Render dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  **Connect GitHub**: Select your repository.
4.  **Configuration**:
    - **Name**: `gemini-rag-backend`
    - **Region**: Choose the one closest to you.
    - **Root Directory**: `backend` (⚠️ Important)
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5.  **Environment Variables** (Click "Advanced" or scroll down):
    Add the following keys and values:
    
    | Key | Value |
    | :--- | :--- |
    | `MONGO_URI` | Your MongoDB connection string from Step 2. |
    | `API_KEY` | Your Google Gemini API Key. |
    | `PORT` | `5000` |

6.  Click **Create Web Service**.
7.  **Wait**: You will see logs. Wait for `✅ MongoDB Connected successfully`.
8.  **Copy URL**: Once live, copy the service URL (e.g., `https://gemini-rag-backend.onrender.com`).

---

## 🖥 Step 4: Deploy Frontend (Vercel)

1.  Log in to [Vercel](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  **Import Git Repository**: Select the same repository.
4.  **Project Settings**:
    - **Framework Preset**: `Vite` (should auto-detect).
    - **Root Directory**: Click "Edit", navigate to `frontend`, and select it.
5.  **Environment Variables**:
    Expand the tab and add:

    | Key | Value |
    | :--- | :--- |
    | `VITE_API_BASE_URL` | Your **Backend URL** from Step 3 (No trailing slash). <br>Example: `https://gemini-rag-backend.onrender.com` |

6.  Click **Deploy**.
7.  Wait for the confetti! 🎉

---

## 🧪 Step 5: Final Verification

1.  Open your **Frontend Deployment URL** (provided by Vercel).
2.  The chat interface should load.
3.  Send a message: *"What is this bot?"*
4.  **Troubleshooting**:
    - **Backend Error / Network Error**: Check the Vercel logs. If it says "CORS" or "Connection Refused", double-check the `VITE_API_BASE_URL` variable in Vercel. It must match the Render backend URL exactly.
    - **Mongo Error**: Check Render logs. If it fails to connect, verify your IP Whitelist in MongoDB Atlas includes `0.0.0.0/0`.

---
**Done! Your app is now live on the web.**
