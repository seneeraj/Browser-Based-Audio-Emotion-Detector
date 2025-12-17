// ============================================
// main.js – PHASE-1 FINAL (4 EMOTIONS ONLY)
// ============================================

import { initialize, detectEmotion } from "./caed.js";


const EMOTION_COLORS = {
  angry: "#e74c3c",      // red
  sad: "#3498db",        // blue
  happy: "#2ecc71",      // green
  surprised: "#f39c12"   // orange
};


// =======================
// DOM ELEMENTS
// =======================
const initBtn = document.getElementById("initBtn");
const startBtn = document.getElementById("startBtn");
const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");
const canvas = document.getElementById("emotionChart");
const ctx = canvas.getContext("2d");

// =======================
// AUDIO STATE
// =======================
let audioCtx = null;
let micSource = null;
let processor = null;

// =======================
// PHASE-1 EMOTIONS (LOCKED)
// =======================
const EMOTIONS = [
  "angry",
  "sad",
  "happy",
  "surprised"
];

// =======================
// INIT
// =======================
initBtn.onclick = async () => {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  await audioCtx.resume();

  await initialize(audioCtx.sampleRate);

  startBtn.disabled = false;
  statusEl.textContent = "Status: Initialized";
};

// =======================
// START DETECTION
// =======================
startBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  micSource = audioCtx.createMediaStreamSource(stream);
  processor = audioCtx.createScriptProcessor(1024, 1, 1);

  processor.onaudioprocess = (event) => {
    const inputData = event.inputBuffer.getChannelData(0);
    const probs = detectEmotion(inputData, audioCtx);

    if (Array.isArray(probs)) {
      renderText(probs);
      drawChart(probs);
    }
  };

  micSource.connect(processor);
  processor.connect(audioCtx.destination);

  statusEl.textContent = "Status: Detecting emotions…";
};

// =======================
// SAFE TEXT RENDER
// =======================
function renderText(probs) {
  let txt = "";

  for (let i = 0; i < EMOTIONS.length; i++) {
    const p = Number.isFinite(probs[i]) ? probs[i] : 0;
    txt += `${EMOTIONS[i]}: ${(p * 100).toFixed(1)}%\n`;
  }

  outputEl.textContent = txt;
}

// =======================
// SAFE, DYNAMIC CANVAS
// =======================
function drawChart(probs) {
  const BAR_WIDTH = 80;
  const GAP = 20;
  const MARGIN = 20;
  const COUNT = EMOTIONS.length;

  // 🔴 ALWAYS resize canvas here
  canvas.width =
    COUNT * BAR_WIDTH +
    (COUNT - 1) * GAP +
    MARGIN * 2;

  canvas.height = 220;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const maxHeight = canvas.height - 60;

  for (let i = 0; i < COUNT; i++) {
    const p = Number.isFinite(probs[i]) ? probs[i] : 0;

    const x = MARGIN + i * (BAR_WIDTH + GAP);
    const h = p * maxHeight;
    const y = canvas.height - h - 30;

    // Bar
    ctx.fillStyle = EMOTION_COLORS[EMOTIONS[i]] || "#999";
    ctx.fillRect(x, y, BAR_WIDTH, h);

    // Label
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      EMOTIONS[i],
      x + BAR_WIDTH / 2,
      canvas.height - 10
    );

    // Percentage
    ctx.font = "13px Arial";
    ctx.fillText(
      `${(p * 100).toFixed(1)}%`,
      x + BAR_WIDTH / 2,
      y - 6
    );
  }
}
