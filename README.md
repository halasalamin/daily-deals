# 🛍️ Daily Deals

**Daily Deals** is a full-stack e-commerce platform that includes:
- A **backend** built with Node.js and MongoDB
- Two **React.js** frontends: one for customers (client) and one for administrators (admin console)
- A **documentation** section with screenshots and test cases

---

## 📁 Project Structure

```
daily-deals/
├── backend/           # Node.js + MongoDB API
├── frontend-client/   # React.js frontend for users
├── frontend-admin-console/    # React.js admin dashboard
├── documentation/     # App screenshots, Postman test results
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/halasalamin/daily-deals.git
cd daily-deals
```

---

### 2. Setup Each Component

#### 📦 Backend (`/backend`)

```bash
cd backend
npm install
npm start   # or node server.js / nodemon server.js
```

Make sure MongoDB is running and your `.env` file has correct DB connection details.

#### 🌐 Frontend Client (`/frontend-client`)

```bash
cd ../frontend-client
npm install
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

#### 🛠️ Admin Console (`/frontend-admin-console`)

```bash
cd ../frontend-admin-console
npm install
npm start
```

Visit: [http://localhost:3001](http://localhost:3001) (or whatever port it's configured to run on)

---

## 📄 Documentation

You can find:
- Screenshots of the user and admin interfaces
- Postman test results
- API endpoint references

in the `/documentation` folder.

---

## ⚙️ Tech Stack

- **Frontend:** React.js, Axios, MUI
- **Backend:** Node.js, Express.js, MongoDB
- **Database:** MongoDB (local or Atlas)
- **Tools:** Postman, Git, VS Code

---

## 🙌 Authors

- Hala Salamin, Dana Hawamdeh and Tala Dweik
