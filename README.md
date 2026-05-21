# 🎙️ Client-Side Audio Emotion Detector (Phase-1)

A **fully client-side, cross-browser Audio Emotion Detection system** that runs entirely in the browser using **JavaScript, Web Audio API, MFCC features, and TensorFlow.js**.

This project demonstrates real-time audio capture, feature extraction, machine learning inference, and visualization — **without any server, backend, or external APIs**.

---

## 🚀 Demo Overview

* 🎤 Uses microphone input directly in the browser
* 📊 Extracts MFCC features from audio chunks
* 🤖 Runs emotion classification using a TensorFlow.js model
* 🎨 Visualizes emotions with color-coded bars
* 🌐 Works across modern browsers (Chrome, Edge, Firefox, Safari)

---

## 🎯 Phase-1 Scope (What This Project Does)

### ✔ Supported Emotion Categories (Phase-1)

This Phase-1 implementation predicts **4 high-level emotions**:

| Emotion       | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| **Angry**     | High-arousal negative emotions (anger, fear, disgust cluster) |
| **Sad**       | Low-arousal negative affect                                   |
| **Happy**     | High-arousal positive affect                                  |
| **Surprised** | High-arousal neutral / novelty                                |

> These categories are intentionally coarse-grained to ensure stability and cross-browser compatibility.

---

## 🧠 How It Works (Architecture)

```
Microphone (Browser)
        ↓
Web Audio API (ScriptProcessorNode)
        ↓
1-Second Audio Chunking
        ↓
MFCC Feature Extraction (Meyda)
        ↓
TensorFlow.js GraphModel
        ↓
EMA Smoothing
        ↓
Emotion Probabilities
        ↓
Canvas Visualization
```

---

## 🛠️ Tech Stack

### Frontend / Runtime

* **JavaScript (ES6 modules)**
* **Web Audio API**
* **HTML5 Canvas**

### Audio & Features

* **Meyda.js** – MFCC extraction (pure JS, cross-browser)

### Machine Learning

* **TensorFlow.js**
* Pre-trained **GraphModel**

### Visualization

* Canvas-based bar chart
* Emotion-aware color coding

---

## 🎨 Emotion Visualization

Each emotion is visualized with a psychologically intuitive color:

| Emotion   | Color     |
| --------- | --------- |
| Angry     | 🔴 Red    |
| Sad       | 🔵 Blue   |
| Happy     | 🟢 Green  |
| Surprised | 🟡 Orange |

Bar height represents probability, updated smoothly over time.

---

## ⏱️ Latency Characteristics

* Emotion inference is **chunk-based (~1 second)**
* Updates are smoothed using **Exponential Moving Average (EMA)**
* Designed for **human-perceived real-time feedback**

> This is an intentional design choice for Phase-1 stability.

---

## ⚠️ Limitations (Phase-1 – Explicit)

This project intentionally accepts the following constraints:

* ❌ No frame-level (instantaneous) emotion detection
* ❌ No fine-grained 8-emotion classification
* ❌ No temporal sequence modeling (RNN / Transformer)
* ❌ Not designed for clinical or medical use

> Emotion predictions are computed over short audio windows (~1 second) to ensure numerical stability and cross-browser support.

---

## 🔮 Phase-2 Roadmap (Planned)

Phase-2 will be developed as a **new project**, building on the learnings from Phase-1.

### Planned Enhancements:

* 🎯 Full **8-emotion classification**
* 🧠 Temporal models (CNN-RNN / GRU / Transformer)
* ⚡ True low-latency (<150ms) emotion updates
* 📈 Sequence-based training
* 🎛️ Improved robustness to noise

> Phase-2 focuses on **true real-time emotion detection**, which requires retraining and temporal modeling.

---

## ▶️ How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/client-side-audio-emotion-detector.git
cd client-side-audio-emotion-detector
```

### 2️⃣ Serve the Files

Because ES modules are used, run via a local server:

```bash
python -m http.server
```

or

```bash
npx serve
```

### 3️⃣ Open in Browser

```
http://localhost:8000
```

### 4️⃣ Usage

1. Click **Initialize**
2. Click **Start Detection**
3. Speak into the microphone
4. Observe emotion probabilities update every ~1 second

---

## 🔐 Privacy & Security

* ✔ No audio is stored
* ✔ No data is sent to any server
* ✔ All processing happens locally in the browser

---

## 📁 Repository Structure

```
├── index.html
├── README.md
├── LICENSE
├── src/
│   ├── main.js
│   ├── caed.js
├── model/
│   ├── model.json
│   ├── *.bin
└── assets/
    └── screenshots/
```

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## 🙌 Acknowledgements

* RAVDESS dataset (used during training, not included)
* TensorFlow.js team
* Meyda.js contributors
* Web Audio API specification

---

## 📌 Final Note

This project represents a **successful Phase-1 implementation** of browser-based audio emotion detection — focused on **stability, transparency, and cross-platform execution**.

It serves as a strong foundation for advanced real-time affective computing systems.

---

Just tell me 👍
