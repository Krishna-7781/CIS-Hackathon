# ⚖️ Load Balancer Simulator

## 📌 Overview

This project is a **Load Balancer Simulator** built using React.
It demonstrates how traffic is distributed across servers using:

* 🔵 **Round Robin Algorithm**
* 🟢 **Least Connections Algorithm**

The simulator also includes **dynamic scaling**, **overload handling**, and **visual animations**, making it a realistic representation of how modern systems manage server load.

---

## 🌐 Live Demo

🚀 **Vercel Deployed Link:**
👉 https://cis-hackathon-gamma.vercel.app

---

## 🚀 Features

* ✅ Real-time traffic simulation
* ✅ Round Robin load balancing
* ✅ Least Connections load balancing
* ✅ Automatic server scaling (3 → 4 servers)
* ✅ Overload detection & redistribution
* ✅ 🔴 Overload animation (red pulse)
* ✅ 🟢 Redistribution animation (green pulse)
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
* **Least Connections** → Requests go to the least loaded server

---

### ⚠️ Overload Handling

* If a server exceeds threshold:

  * It becomes **inactive**
  * Load is **redistributed** to other active servers
  * Cooldown period starts
  * 🔴 Server shows **overload animation**

---

### ➕ Auto Scaling

* If **all 3 servers are overloaded**:

  * ➜ A **4th server is automatically created**

---

### 🚨 Alert Condition

* If **all 4 servers are overloaded**:

  * ⚠️ Alert message is triggered
  * ⛔ Simulation stops

---

## 📊 Visualization

* Real-time bar chart showing:

  * Server loads
  * Comparison between Round Robin & Least Connections

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

This project is deployed using **Vercel**.

### Deploy Steps:

```bash
npm run build
```

* Upload project to GitHub
* Import into Vercel
* Set:

  * **Build Command:** `npm run build`
  * **Output Directory:** `dist`

---

## 🎬 Demo Flow (For Presentation)

1. Click **Start**
2. Traffic gradually increases
3. Servers begin to overload
4. 🔁 Load redistribution happens
5. ➕ 4th server is created
6. 🚨 All servers overload → alert triggers

---

## 📈 Future Improvements

* Add more load balancing algorithms
* Add request queue visualization
* Add manual traffic control (slider)
* Add performance metrics dashboard
* Improve UI/UX animations

---

## 👨‍💻 Authors

* **A Sudarsan Krishna**
* **N Sai Suhaas**
* **P Rakesh**
* **Y Karthikeya**

---

## ⭐ Acknowledgement

This project was developed as part of a **hackathon** to demonstrate real-time system design concepts in an interactive way.

---

## 📌 Note

Due to differences between development and production environments, slight timing variations may occur. The logic has been optimized to ensure consistent behavior across platforms like Vercel.

---
