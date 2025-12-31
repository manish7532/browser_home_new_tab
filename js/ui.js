import wallpaper from "./wallpaper.js";
import { Storage, KEYS } from "./storage.js";

let shortcuts = [];
let editingIndex = null;

let shortcutsSvgs = {
  "https://youtube.com/": `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" /></svg>`,
  "https://www.youtube.com/": `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" /></svg>`,
  "https://music.youtube.com/": `<svg viewBox="0 0 100 100" version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs><mask id="playCutout"> <rect x="0" y="0" width="100" height="100" fill="white" /><path d="M41.055,52.528c-0.001,2.575,0.001,7.867,0,10.46c0,0,21.802-13.417,21.802-13.417L41.055,37.272V52.528z" fill="black" /></mask></defs><g mask="url(#playCutout)"><path fill="#FF0000" d="M50,2.5C23.766,2.5,2.5,23.823,2.5,50.126c2.502,63.175,92.507,63.157,95-0.001C97.5,23.823,76.233,2.5,50,2.5zM50,77.399c-15.036,0-27.27-12.233-27.27-27.27c0.74-18.662,14.654-27.134,27.269-27.134c0.001,0,0.001,0,0.002,0c12.616,0.001,26.531,8.473,27.267,27.073C77.27,65.167,65.036,77.399,50,77.399z" /><path fill="#FF0000" d="M50.002,26.103c-15.946-0.001-23.704,12.486-24.165,24.088C25.838,63.453,36.677,74.292,50,74.292S74.162,63.453,74.162,50.13C73.705,38.591,65.948,26.105,50.002,26.103z" /></g></svg>`,
  "https://chatgpt.com/": `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 509.639"><path fill="#fff" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z" /> <path fill-rule="nonzero" d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z" /></svg>`,
  "https://mail.google.com/": `<svg xmlns="http://www.w3.org/2000/svg" aria-label="Gmail" role="img" viewBox="0 0 512 512" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect width="512" height="512" rx="15%" fill="#ffffff"></rect><path d="M158 391v-142l-82-63V361q0 30 30 30" fill="#4285f4"></path><path d="M 154 248l102 77l102-77v-98l-102 77l-102-77" fill="#ea4335"></path><path d="M354 391v-142l82-63V361q0 30-30 30" fill="#34a853"></path><path d="M76 188l82 63v-98l-30-23c-27-21-52 0-52 26" fill="#c5221f"></path><path d="M436 188l-82 63v-98l30-23c27-21 52 0 52 26" fill="#fbbc04"></path></g></svg>`,
  "https://meet.google.com/": `<svg viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="#000000">   <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g> <g id="SVGRepo_iconCarrier">        <path d="M24,21.45V25a2.0059,2.0059,0,0,1-2,2H9V21h9V16Z" fill="#00ac47"></path>        <polygon fill="#31a950" points="24 11 24 21.45 18 16 18 11 24 11"></polygon>        <polygon fill="#ea4435" points="9 5 9 11 3 11 9 5"></polygon>        <rect fill="#4285f4" height="11" width="6" x="3" y="11"></rect>      <path d="M24,7v4h-.5L18,16V11H9V5H22A2.0059,2.0059,0,0,1,24,7Z" fill="#ffba00"></path>        <path d="M9,21v6H5a2.0059,2.0059,0,0,1-2-2V21Z" fill="#0066da"></path>        <path            d="M29,8.26V23.74a.9989.9989,0,0,1-1.67.74L24,21.45,18,16l5.5-5,.5-.45,3.33-3.03A.9989.9989,0,0,1,29,8.26Z"  fill="#00ac47"></path>        <polygon fill="#188038" points="24 10.55 24 21.45 18 16 23.5 11 24 10.55"></polygon></g></svg>`,
};

const keywords = [
  "mail.google",
  "meet.google",
  "chatgpt",
  "youtube.com",
  "music.youtube",
];

function normalizeUrl(raw) {
  if (!raw) return raw;
  try {
    const u = new URL(raw);
    return u.href;
  } catch (e) {
    // try adding https
    try {
      const u2 = new URL("https://" + raw);
      return u2.href;
    } catch (ee) {
      return raw;
    }
  }
}

function faviconFor(url) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?sz=64&domain=${u.hostname}`;
  } catch (e) {
    return "";
  }
}

function loadShortcutsFromStorage() {
  const saved = Storage.getJSON(KEYS.SHORTCUTS);
  if (saved && Array.isArray(saved)) {
    shortcuts = saved;
    return;
  }

  // Fallback - parse existing DOM anchors as defaults, and capture inline SVG if present
  const nodes = document.querySelectorAll(".shortcuts-grid > a.shortcut-card");
  shortcuts = [];
  nodes.forEach((a) => {
    if (a.id === "addShortcut") return;
    const url = a.href;
    const label =
      a.querySelector(".shortcut-label")?.textContent?.trim() || url;
    const svgEl = a.querySelector(".icon-box svg");
    const s = { label, url };
    if (svgEl) {
      s.iconSvg = svgEl.outerHTML;
    }
    shortcuts.push(s);
  });

  Storage.setJSON(KEYS.SHORTCUTS, shortcuts);
}

function saveShortcuts() {
  Storage.setJSON(KEYS.SHORTCUTS, shortcuts);
}

function getColorForSeed(seed) {
  const palette = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFC107",
    "#FF9800",
    "#FF5722",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  const idx = Math.abs(h) % palette.length;
  return palette[idx];
}

function createLetterAvatar(text, url) {
  const ch = text && text[0] ? text[0].toUpperCase() : url ? url[2] : "?";
  const seed = url || text || ch;
  const bg = getColorForSeed(seed);
  const el = document.createElement("div");
  el.className = "letter-avatar";
  el.textContent = ch;
  el.style.background = bg;
  return el;
}

function renderShortcuts() {
  const grid = document.querySelector(".shortcuts-grid");
  if (!grid) return;
  grid.innerHTML = "";

  shortcuts.forEach((s, idx) => {
    const a = document.createElement("a");
    a.className = "shortcut-card shortcut-card-contextmenu";
    a.href = s.url;
    a.title = s.url;

    const icon = document.createElement("div");
    icon.className = "icon-box";
    const urlStr = s.url;

    const matches = keywords.some((keyword) => urlStr.includes(keyword));
    if (matches) {
      console.log(matches);
      console.log(urlStr);
      icon.innerHTML = shortcutsSvgs[s.url];
    } else {
      const img = document.createElement("img");
      img.className = "favicon";
      img.alt = s.label;
      img.src = faviconFor(s.url);

      // Fallback to letter avatar on error or tiny images
      const fallbackToAvatar = () => {
        icon.innerHTML = "";
        icon.appendChild(createLetterAvatar(s.label, s.url));
      };

      img.addEventListener("error", fallbackToAvatar);
      img.addEventListener("load", () => {
        if (!img.naturalWidth || img.naturalWidth < 6) fallbackToAvatar();
      });

      icon.appendChild(img);
    }

    const label = document.createElement("span");
    label.className = "shortcut-label";
    label.textContent = s.label;

    a.appendChild(icon);
    a.appendChild(label);

    grid.appendChild(a);
  });

  // Add 'Add' card
  const add = document.createElement("a");
  add.id = "addShortcut";
  add.className = "shortcut-card";
  add.href = "";
  add.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("add");
  });

  const addIcon = document.createElement("div");
  addIcon.className = "icon-box";
  addIcon.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path fill="#fff" fill-rule="evenodd" d="M12 4a.85.85 0 0 0-.85.85v6.3h-6.3a.85.85 0 0 0 0 1.7h6.3v6.3a.85.85 0 0 0 1.7 0v-6.3h6.3a.85.85 0 0 0 0-1.7h-6.3v-6.3A.85.85 0 0 0 12 4" clip-rule="evenodd"/></svg>';
  const addLabel = document.createElement("span");
  addLabel.className = "shortcut-label";
  addLabel.textContent = "Add";

  add.appendChild(addIcon);
  add.appendChild(addLabel);

  grid.appendChild(add);

  // Reapply tilt interactions
  bindShortcutTilt();
}

function bindShortcutTilt() {
  const cards = document.querySelectorAll(".shortcut-card");
  const cardsContext = document.querySelectorAll(".shortcut-card-contextmenu");
  if (!("ontouchstart" in window)) {
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * 6; // rotateX
        const ry = (px - 0.5) * -6; // rotateY
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.03)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
  cardsContext.forEach((card) => {
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const idx = Array.from(cardsContext).indexOf(card);
      openModal("edit", idx);
    });
  });
}

function openModal(mode, idx = null) {
  const overlay = document.getElementById("shortcut-modal");
  const form = document.getElementById("shortcut-form");
  const labelInput = document.getElementById("shortcut-label");
  const urlInput = document.getElementById("shortcut-url");
  const deleteBtn = document.querySelector(".delete-btn");

  editingIndex = null;
  deleteBtn.classList.add("hidden");

  if (mode === "edit" && typeof idx === "number") {
    const s = shortcuts[idx];
    if (s) {
      labelInput.value = s.label;
      urlInput.value = s.url;
      editingIndex = idx;
      deleteBtn.classList.remove("hidden");
    }
    overlay.querySelector("h3").textContent = "Edit Shortcut";
  } else {
    overlay.querySelector("h3").textContent = "Add Shortcut";
    labelInput.value = "";
    urlInput.value = "";
  }

  overlay.classList.remove("hidden");
  setTimeout(() => overlay.classList.add("visible"), 10);

  // focus
  setTimeout(() => labelInput.focus(), 180);
}

function closeModal() {
  const overlay = document.getElementById("shortcut-modal");
  overlay.classList.add("hidden");
}

export function initUI() {
  const settingsBtn = document.getElementById("settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  const closeSettingsBtn = document.getElementById("close-settings");
  const bgModeInputs = document.querySelectorAll('input[name="bg-mode"]');
  const colorSwatches = document.querySelectorAll(".color-swatch");

  // Settings toggle
  settingsBtn?.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
  });

  closeSettingsBtn?.addEventListener("click", () => {
    settingsPanel.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
      settingsPanel.classList.add("hidden");
    }
  });

  // Background options
  const currentMode = Storage.getRaw(KEYS.MODE) || "online";
  const modeInput = document.querySelector(
    `input[name="bg-mode"][value="${currentMode}"]`
  );
  if (modeInput) modeInput.checked = true;

  const currentSolidColor = Storage.getRaw(KEYS.SOLID) || "#3b3b3f";
  colorSwatches.forEach((sw) => {
    if (sw.getAttribute("data-color") === currentSolidColor)
      sw.classList.add("active");
    else sw.classList.remove("active");
  });

  bgModeInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const v = e.target.value;
      wallpaper.setMode(v);
    });
  });

  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", (e) => {
      const color = swatch.getAttribute("data-color");
      wallpaper.setSolidColor(color);
      // Update UI
      colorSwatches.forEach((s) => s.classList.remove("active"));
      swatch.classList.add("active");
      // Ensure solid mode selected
      const solidRadio = document.querySelector('input[value="solid"]');
      if (solidRadio && !solidRadio.checked) {
        solidRadio.checked = true;
        wallpaper.setMode("solid");
      }
    });
  });

  // Modal bindings
  const overlay = document.getElementById("shortcut-modal");
  const form = document.getElementById("shortcut-form");
  const labelInput = document.getElementById("shortcut-label");
  const urlInput = document.getElementById("shortcut-url");
  const cancelBtn = document.querySelector(".cancel-btn");
  const deleteBtn = document.querySelector(".delete-btn");

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      shortcuts.splice(editingIndex, 1);
      saveShortcuts();
      renderShortcuts();
    }
    closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const label = labelInput.value.trim();
    const url = normalizeUrl(urlInput.value.trim());
    if (!label || !url) return;

    if (editingIndex === null) {
      shortcuts.push({ label, url });
    } else {
      shortcuts[editingIndex] = { label, url };
    }
    saveShortcuts();
    renderShortcuts();
    closeModal();
  });

  // Escape to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Load and render shortcuts
  loadShortcutsFromStorage();
  renderShortcuts();
}
