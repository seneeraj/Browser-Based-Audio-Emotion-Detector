// ============================================
// caed.js – PHASE-1 STABLE (CROSS-BROWSER)
// MFCC: Meyda | Chunk-based | EMA smoothing
// ============================================

// =======================
// CONFIG
// =======================
const MODEL_PATH = "./model/model.json";

const EMOTIONS = [
  "angry",
  "calm",
  "disgust",
  "fearful",
  "happy",
  "neutral",
  "sad",
  "surprised"
];

const MFCC_COUNT = 13;
const CHUNK_DURATION_SEC = 1.0;
const EMA_ALPHA = 0.85;
const MFCC_BUFFER_SIZE = 1024; // power of 2

// =======================
// STATE
// =======================
let model = null;
let initialized = false;

let audioBuffer = [];
let targetChunkSize = 0;
let lastSmoothed = null;

// =======================
// INITIALIZE
// =======================
async function initialize(sampleRate) {
  model = await tf.loadGraphModel(MODEL_PATH);
  initialized = true;

  targetChunkSize = Math.floor(sampleRate * CHUNK_DURATION_SEC);

  console.log("✅ CAED initialized");
  console.log("Sample rate:", sampleRate);
  console.log("Chunk size:", targetChunkSize);

  return true;
}

// =======================
// DETECT EMOTION
// =======================
function detectEmotion(audioFrame, audioCtx) {
  if (!initialized || !model) {
    return lastSmoothed;
  }

  // Accumulate audio
  audioBuffer.push(...audioFrame);

  if (audioBuffer.length < targetChunkSize) {
    return lastSmoothed;
  }

  // Consume one chunk
  const chunk = audioBuffer.splice(0, targetChunkSize);

  // Prepare MFCC frame (guaranteed power-of-2)
  let frame;
  if (chunk.length >= MFCC_BUFFER_SIZE) {
    frame = chunk.slice(chunk.length - MFCC_BUFFER_SIZE);
  } else {
    frame = new Array(MFCC_BUFFER_SIZE).fill(0);
    for (let i = 0; i < chunk.length; i++) {
      frame[i] = chunk[i];
    }
  }

  // MFCC extraction
const mfcc = Meyda.extract(
  "mfcc",
  frame,                         // ← signal ONLY
  {
    sampleRate: audioCtx.sampleRate,
    bufferSize: MFCC_BUFFER_SIZE, // 1024
    numberOfMFCCCoefficients: MFCC_COUNT
  }
);


  if (!mfcc || mfcc.some(v => !Number.isFinite(v))) {
    console.warn("Invalid MFCC frame skipped");
    return lastSmoothed;
  }

  // Model inference
  const inputTensor = tf.tensor2d([mfcc], [1, MFCC_COUNT]);

  const logits = model.execute(
    { [model.inputs[0].name]: inputTensor },
    model.outputs[0].name
  );

  const probsTensor = tf.softmax(logits);
  let probs = Array.from(probsTensor.dataSync());

  tf.dispose([inputTensor, logits, probsTensor]);

  // Normalize
  const sum = probs.reduce((a, b) => a + b, 0);
  if (sum > 0) {
    probs = probs.map(p => p / sum);
  } else {
    probs = new Array(EMOTIONS.length).fill(1 / EMOTIONS.length);
  }

  // EMA smoothing
  if (!lastSmoothed) {
    lastSmoothed = probs;
  } else {
    lastSmoothed = probs.map(
      (p, i) => EMA_ALPHA * lastSmoothed[i] + (1 - EMA_ALPHA) * p
    );
  }

  return lastSmoothed;
}

// =======================
// EXPORTS
// =======================
export { initialize, detectEmotion };
