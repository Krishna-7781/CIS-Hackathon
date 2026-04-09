# ⚖️ Load Balancer Simulator

## 📌 Overview

This project is a **Load Balancer Simulator** built using React.
It demonstrates how traffic is distributed across servers using:

* 🔵 **Round Robin Algorithm**
* 🟢 **Least Connections Algorithm**

The simulator also includes **dynamic scaling** and **overload handling**, making it a realistic representation of how modern systems manage server load.

---

## 🚀 Features

* ✅ Real-time traffic simulation
* ✅ Round Robin load balancing
* ✅ Least Connections load balancing
* ✅ Automatic server scaling
* ✅ Overload detection & redistribution
* ✅ Visual traffic graph using Chart.js
* ✅ Server cooldown & recovery system

---

## ⚙️ Working Logic

### 🖥️ Initial State

* Starts with **3 servers**
* Each server receives traffic requests

---

### 🔁 Load Distribution

* **Round Robin** → Requests are assigned sequentially
* **Least Connections** → Requests go to least loaded server

---

### ⚠️ Overload Handling

* If a server exceeds threshold:

  * It becomes **inactive**
  * Load is **redistributed** to other active servers
  * Cooldown period starts

---

### ➕ Auto Scaling

* If **all 3 servers are overloaded**:

  * ➜ A **4th server is automatically created**

---

### 🚨 Alert Condition

* If **all 4 servers are overloaded**:

  * ⚠️ Alert message is shown
  * ⛔ Simulation stops

---

## 📊 Visualization

* Real-time bar chart showing:

  * Server loads
  * Comparison between algorithms

---

## 🛠️ Tech Stack

* **React (Vite)**
* **Chart.js**
* **JavaScript (ES6+)**
* **CSS**

---

## 📂 Project Structure

```
Load-Balancer-Simulator/
│── public/
│── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
│── index.html
│── package.json
│── vite.config.js
```

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

---

## 🌐 Deployment

This project is deployed using Netlify.

To deploy manually:

```bash
npm run build
```

Upload the `dist/` folder to Netlify.

---

## 📈 Future Improvements

* Add more load balancing algorithms
* Add request queue visualization
* Add user-controlled traffic rate
* Improve UI animations

---

## 👨‍💻 Author

**A Sudarsan Krishna, N Sai Suhaas, P Rakesh, Y Karthikeya**

---

## ⭐ Acknowledgement

This project was developed as part of a hackathon to demonstrate real-time system design concepts in an interactive way.

---

## 📌 Note

Due to differences between development and production environments, minor behavior variations may occur in deployment platforms. The logic is optimized to work consistently across environments.

---
