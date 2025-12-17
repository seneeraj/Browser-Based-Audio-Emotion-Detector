// =====================================================
// mfcc.js — Minimal MFCC extraction (librosa-like)
// =====================================================

const SAMPLE_RATE = 22050;
const N_FFT = 2048;
const N_MELS = 26;
const N_MFCC = 13;

// ---------- Utility ----------
function hzToMel(hz) {
  return 2595 * Math.log10(1 + hz / 700);
}

function melToHz(mel) {
  return 700 * (10 ** (mel / 2595) - 1);
}

// ---------- Hann window ----------
function hannWindow(size) {
  const w = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
  }
  return w;
}

// ---------- DCT ----------
function dct(vector, numCoeffs) {
  const N = vector.length;
  const result = new Float32Array(numCoeffs);

  for (let k = 0; k < numCoeffs; k++) {
    let sum = 0;
    for (let n = 0; n < N; n++) {
      sum += vector[n] * Math.cos((Math.PI * k * (2 * n + 1)) / (2 * N));
    }
    result[k] = sum;
  }
  return result;
}

// ---------- Mel filter bank ----------
function melFilterBank() {
  const lowMel = hzToMel(0);
  const highMel = hzToMel(SAMPLE_RATE / 2);
  const melPoints = Array.from({ length: N_MELS + 2 }, (_, i) =>
    melToHz(lowMel + (i * (highMel - lowMel)) / (N_MELS + 1))
  );

  const fftFreqs = Array.from({ length: N_FFT / 2 + 1 }, (_, i) =>
    (i * SAMPLE_RATE) / N_FFT
  );

  return melPoints.slice(1, -1).map((center, i) => {
    const left = melPoints[i];
    const right = melPoints[i + 2];

    return fftFreqs.map(f =>
      f < left || f > right
        ? 0
        : f <= center
        ? (f - left) / (center - left)
        : (right - f) / (right - center)
    );
  });
}

// ---------- MFCC extraction ----------
const WINDOW = hannWindow(N_FFT);
const MEL_FILTERS = melFilterBank();

export function extractMFCC(timeSignal) {
  // Frame
  const frame = timeSignal.slice(0, N_FFT).map((v, i) => v * WINDOW[i]);

  // FFT
  const spectrum = new Float32Array(N_FFT / 2 + 1);
  for (let i = 0; i < spectrum.length; i++) {
    spectrum[i] = Math.abs(frame[i]);
  }

  // Mel energies
  const melEnergies = MEL_FILTERS.map(filter =>
    filter.reduce((sum, w, i) => sum + w * spectrum[i], 0)
  );

  // Log
  const logMel = melEnergies.map(v => Math.log(v + 1e-6));

  // DCT → MFCC
  return dct(logMel, N_MFCC);
}
