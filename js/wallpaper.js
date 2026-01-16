import { Storage, KEYS } from "./storage.js";

const body = document.getElementById("body");
const blurEl = document.getElementById("bg-blur");
const fullEl = document.getElementById("bg-full");
const creditEl = document.getElementById("photo-credit");

const OFFLINE_MIN = 1;
const OFFLINE_MAX = 5;
const OFFLINE_EXTENSIONS = ["jpg", "jpeg", "png", "jfif", "webp"];
const fallbackUrl = "walls/1.png";

let currentMode = Storage.getRaw(KEYS.MODE) || "online";
let currentSolidColor = Storage.getRaw(KEYS.SOLID) || "#3b3b3f";
let attempt = 0;

export async function init() {
  applyState();
  // Prefetch in background once initiated
  if (currentMode === "online") {
    fetchNextWallpaper(false);
  }

  // Simple parallax for subtle depth
  initParallax();
}

function initParallax() {
  // Disable on touch devices
  if ("ontouchstart" in window) return;

  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 14; // range ~ -7..7
    const y = (e.clientY / window.innerHeight - 0.5) * 10; // range ~ -5..5

    // Translate small amounts to create parallax
    fullEl.style.transform = `translate(${x}px, ${y}px) scale(1.01)`;
    blurEl.style.transform = `translate(${x * 0.45}px, ${y * 0.45}px) scale(1.08)`;
  });
}

export function getMode() {
  return currentMode;
}

export function setMode(mode) {
  currentMode = mode;
  Storage.setRaw(KEYS.MODE, mode);
  applyState();
}

export function setSolidColor(color) {
  currentSolidColor = color;
  Storage.setRaw(KEYS.SOLID, color);
  applyState();
}

function applyState() {
  // Reset state
  body.style.backgroundColor = "#1a1a1a";
  body.classList.remove("loaded");
  blurEl.style.backgroundImage = "";
  fullEl.style.backgroundImage = "";
  fullEl.classList.remove("visible");
  creditEl.classList.remove("visible");

  switch (currentMode) {
    case "online":
      loadOnlineWallpaper();
      break;
    case "offline":
      loadOfflineWallpaper();
      break;
    case "solid":
      body.style.backgroundColor = currentSolidColor;
      break;
    case "none":
      // do nothing (just the base color)
      break;
  }
}

function loadOnlineWallpaper() {
  const cachedUrl = Storage.getRaw(KEYS.NEXT);
  if (cachedUrl) {
    setImageBackground(cachedUrl);
    // keep fetching a next one in background
    fetchNextWallpaper(false);
  } else {
    fetchNextWallpaper(true);
  }
}

async function fetchNextWallpaper(applyNow = false) {
  attempt++;

  const endpoints = [
    "https://bingw.jasonzeng.dev?resolution=UHD&index=random&format=json",
    "https://bingw.jasonzeng.dev?resolution=1920x1080&index=random&format=json",
  ];

  try {
    for (const api of endpoints) {
      const response = await fetch(api);
      if (!response.ok) continue;

      const data = await response.json();
      if (!data?.url) continue;

      const url = data.url;
      const credit = data?.copyright ?? "";

      // Basic validation by fetching HEAD
      const isValid = await isImageUrlValid(url);
      if (!isValid) continue;

      Storage.setRaw(KEYS.NEXT, url);

      if (applyNow) {
        setImageBackground(url, credit);
      }

      return;
    }

    throw new Error("All wallpaper sources failed");
  } catch (e) {
    console.warn("Wallpaper fetch failed:", e);
    Storage.setRaw(KEYS.NEXT, null);

    if (attempt < 3) {
      fetchNextWallpaper(applyNow);
    } else {
      loadOfflineWallpaper();
    }
  }
}

function loadOfflineWallpaper() {
  const randomIndex =
    Math.floor(Math.random() * (OFFLINE_MAX - OFFLINE_MIN + 1)) + OFFLINE_MIN;

  tryOfflineFormats(randomIndex, 0);
}

function tryOfflineFormats(index, extIndex) {
  if (extIndex >= OFFLINE_EXTENSIONS.length) {
    setImageBackground(fallbackUrl);
    return;
  }

  const url = `walls/${index}.${OFFLINE_EXTENSIONS[extIndex]}`;
  const img = new Image();
  img.onload = () => {
    setImageBackground(url);
  };
  img.onerror = () => {
    tryOfflineFormats(index, extIndex + 1);
  };
  img.src = url;
}

async function isImageUrlValid(url, timeout = 6000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const res = await fetch(url, { method: "HEAD", mode: "cors", signal: controller.signal });
    clearTimeout(timer);

    return res.ok && res.headers.get("content-type")?.startsWith("image/");
  } catch {
    return false;
  }
}

function setImageBackground(url, credit = "") {
  // Set a blurred preview immediately
  blurEl.style.backgroundImage = `url('${url}')`;
  blurEl.style.opacity = "0.6";

  // Prepare full image and crossfade
  const img = new Image();
  img.onload = () => {
    fullEl.style.backgroundImage = `url('${url}')`;
    // trigger fade
    requestAnimationFrame(() => {
      fullEl.classList.add("visible");
      body.classList.add('loaded');
      creditEl.textContent = credit ? credit : "";
      creditEl.classList.toggle('visible', Boolean(credit));

      // gently reduce blur prominence after the full image is visible
      setTimeout(() => {
        blurEl.style.transition = 'opacity 800ms ease';
        blurEl.style.opacity = '0.18';
      }, 400);
    });
  };
  img.onerror = () => {
    if (url !== fallbackUrl) {
      setImageBackground(fallbackUrl);
    }
  };
  img.src = url;
}

export default {
  init,
  setMode,
  setSolidColor,
  getMode,
};
