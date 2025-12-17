const body = document.getElementById("body");

// Elements
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const closeSettingsBtn = document.getElementById("close-settings");

// Inputs
const bgModeInputs = document.querySelectorAll('input[name="bg-mode"]');
const colorSwatches = document.querySelectorAll(".color-swatch");

// Storage Configuration
const STORAGE_KEY_MODE = "wallpaper_mode"; // 'online', 'offline', 'solid', 'none'
const STORAGE_KEY_SOLID_COLOR = "wallpaper_solid_color";
const STORAGE_KEY_NEXT_WALLPAPER = "wallpaper_next_url";

// State
let currentMode = "online";
let currentSolidColor = "#1a1a1a";

// Default Offline Wallpapers (ensure these exist in 'walls/')
const offlineWallpapers = ["walls/wallpaper.jpg"];
const fallbackUrl = "walls/wallpaper.jpg";

// --- Initialization ---

function init() {
  loadState();
  applyState();
  setupEventListeners();
}

function loadState() {
  try {
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
    if (savedMode) currentMode = savedMode;

    const savedColor = localStorage.getItem(STORAGE_KEY_SOLID_COLOR);
    if (savedColor) currentSolidColor = savedColor;
  } catch (e) {
    console.warn("Storage access error:", e);
  }

  // Update UI inputs to match state
  const modeInput = document.querySelector(
    `input[name="bg-mode"][value="${currentMode}"]`
  );
  if (modeInput) modeInput.checked = true;

  updateSwatchUI();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY_MODE, currentMode);
    localStorage.setItem(STORAGE_KEY_SOLID_COLOR, currentSolidColor);
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

// --- Logic ---

function applyState() {
  // Clear previous inline styles
  body.style.backgroundImage = "";
  body.style.backgroundColor = "#1a1a1a"; // Default dark base
  body.classList.remove("loaded");

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
      // Just keeps the default background-color #1a1a1a set above
      break;
  }
}

function loadOnlineWallpaper() {
  // 1. Try to load immediately from cache
  const cachedUrl = localStorage.getItem(STORAGE_KEY_NEXT_WALLPAPER);
  if (cachedUrl) {
    setImageBackground(cachedUrl);
    // 2. Fetch the NEXT wallpaper in background for the next time
    fetchNextWallpaper(false);
  } else {
    // First run or cache empty: Fetch and apply immediately
    fetchNextWallpaper(true);
  }
}

async function fetchNextWallpaper(applyNow = false) {
  try {
    // Fetch from Bing Wallpaper Archive (Unofficial API)
    // index=random: gets smooth random image from years of archive (not just daily)
    // resolution=UHD: ensures 4K quality (highest possible)
    const response = await fetch(
      "https://bingw.jasonzeng.dev?resolution=UHD&index=random&format=json"
    );

    if (!response.ok) throw new Error("Wallpaper API failed");

    const data = await response.json();
    if (data && data.url) {
      // Preload the image so it's ready in browser disk cache
      const img = new Image();
      img.src = data.url;

      // Save for next time
      localStorage.setItem(STORAGE_KEY_NEXT_WALLPAPER, data.url);

      // If we needed it immediately (no cache)
      if (applyNow) {
        setImageBackground(data.url);
      }
    } else {
      throw new Error("No URL in response");
    }
  } catch (e) {
    console.warn("Wallpaper fetch failed:", e);
    // Only fall back to offline if we were trying to display it NOW and failed
    if (applyNow) {
      loadOfflineWallpaper();
    }
  }
}

function loadOfflineWallpaper() {
  if (offlineWallpapers.length === 0) {
    setImageBackground(fallbackUrl);
    return;
  }
  const index = Math.floor(Math.random() * offlineWallpapers.length);
  setImageBackground(offlineWallpapers[index]);
}

function setImageBackground(url) {
  const img = new Image();
  img.onload = () => {
    body.style.backgroundImage = `url('${url}')`;
    body.classList.add("loaded");
  };
  img.onerror = () => {
    if (url !== fallbackUrl) {
      setImageBackground(fallbackUrl);
    }
  };
  img.src = url;
}

// --- UI / Event Listeners ---

function setupEventListeners() {
  // Toggle Panel
  settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
  });

  closeSettingsBtn.addEventListener("click", () => {
    settingsPanel.classList.add("hidden");
  });

  // Close panel when clicking outside
  document.addEventListener("click", (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
      settingsPanel.classList.add("hidden");
    }
  });

  // Mode Selection
  bgModeInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      currentMode = e.target.value;
      saveState();
      applyState();
    });
  });

  // Color Selection
  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", (e) => {
      currentSolidColor = e.target.getAttribute("data-color");
      updateSwatchUI();

      // If we are already in solid mode, apply immediately.
      // If user clicked color but mode wasn't solid (rare case given UI), we should probably switch to solid.
      const solidRadio = document.querySelector('input[value="solid"]');
      if (!solidRadio.checked) {
        solidRadio.checked = true;
        currentMode = "solid";
      }

      saveState();
      applyState();
    });
  });
}

function updateSwatchUI() {
  colorSwatches.forEach((swatch) => {
    if (swatch.getAttribute("data-color") === currentSolidColor) {
      swatch.classList.add("active");
    } else {
      swatch.classList.remove("active");
    }
  });
}

// --- Favicon Logic ---

const FAVICONS = {
  chrome: "icons/chrome.svg",
  firefox: "icons/firefox.svg",
  brave: "icons/brave.svg",
  edge: "icons/edge.svg",
  generic: "icons/safari.svg",
};

async function updateFavicon() {
  const favicon = document.getElementById("favicon");
  if (!favicon) return;

  const ua = navigator.userAgent;
  let icon = FAVICONS.generic;

  if (navigator.brave && (await navigator.brave.isBrave())) {
    icon = FAVICONS.brave;
  } else if (ua.indexOf("Firefox") > -1) {
    icon = FAVICONS.firefox;
  } else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) {
    icon = FAVICONS.chrome;
  } else if (ua.indexOf("Edg") > -1) {
    icon = FAVICONS.edge;
  }

  favicon.href = icon;
}

// Start
init();
updateFavicon();
