# **OAuth Example with Auth0**

This project demonstrates OAuth 2.0 authentication using **Auth0** with PKCE in a microservices architecture, including a backend dashboard, a frontend application, and a challenges API service.

---

## **📌 Installation and Configuration**

### **1️⃣ Setup and Run the Dashboard Backend (`dashboard-backend`)**

#### **Installation Steps:**
```bash
cd dashboard-backend
npm install
node index.js
```

#### **Create a `.env` file with the following variables:**
```ini
# Backend port
PORT=3001

# Auth0 Configuration
AUTH0_DOMAIN=xxx.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_TOKEN_ENDPOINT=https://xxx.us.auth0.com/oauth/token
AUTH0_REDIRECT_URI=http://localhost:3000/challenges

# CORS Configuration
FRONTEND_URL=http://localhost:3000
CHALLENGES_API_URL=http://localhost:8080/challenges
```

---

### **2️⃣ Setup and Run the Frontend (`dashboard-frontend`)**

#### **Installation Steps:**
```bash
cd dashboard-frontend
npm install
npm start
```

#### **Create a `.env` file with the following variables:**
```ini
# Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=xxx.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_AUDIENCE=https://challenges-api.com
REACT_APP_AUTH0_REDIRECT_URI=http://localhost:3000/challenges

# Backend Configuration
REACT_APP_BACKEND_URL=http://localhost:3001
```

---

### **3️⃣ Setup and Run the Challenges API (`challenges-api`)**

#### **Installation Steps:**
```bash
cd challenges-api
npm install
node index.js
```

#### **Create a `.env` file with the following variables:**
```ini
# Server Port
PORT=8080

# Auth0 Configuration
AUTH0_DOMAIN=xxx.us.auth0.com
AUTH0_AUDIENCE=https://challenges-api.com
AUTH0_JWKS_URI=https://xxx.us.auth0.com/.well-known/jwks.json
AUTH0_ISSUER=https://xxx.us.auth0.com/

# CORS Configuration
FRONTEND_URL=http://localhost:3001
```

---

## **🚀 Usage Instructions**

1. Start all services (`dashboard-backend`, `dashboard-frontend`, and `challenges-api`).
2. Navigate to `http://localhost:3000` in your browser.
3. Click **Log In** and authenticate via Auth0.
4. Once authenticated, you will be redirected to the challenges page.
5. The frontend will retrieve challenges from the API using an access token.

---

## **🛠 Troubleshooting**
- Ensure all `.env` files are correctly set up.
- Check that all services (`dashboard-backend`, `dashboard-frontend`, and `challenges-api`) are running properly.
- Verify that the Auth0 application is configured with the correct callback and allowed origins.
- If you encounter **CORS errors**, ensure the correct `FRONTEND_URL` is set in the backend and API configurations.

---

## **📜 License**
This project is licensed under the MIT License.

