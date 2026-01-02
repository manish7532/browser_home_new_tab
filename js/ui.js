import wallpaper from "./wallpaper.js";
import { Storage, KEYS } from "./storage.js";

let shortcuts = [];
let editingIndex = null;

let shortcutsSvgs = {
  "https://youtube.com/": `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" /></svg>`,
  "https://www.youtube.com/": `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" /></svg>`,
  "https://music.youtube.com/": `<svg viewBox="0 0 100 100" version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs><mask id="playCutout"> <rect x="0" y="0" width="100" height="100" fill="white" /><path d="M41.055,52.528c-0.001,2.575,0.001,7.867,0,10.46c0,0,21.802-13.417,21.802-13.417L41.055,37.272V52.528z" fill="black" /></mask></defs><g mask="url(#playCutout)"><path fill="#FF0000" d="M50,2.5C23.766,2.5,2.5,23.823,2.5,50.126c2.502,63.175,92.507,63.157,95-0.001C97.5,23.823,76.233,2.5,50,2.5zM50,77.399c-15.036,0-27.27-12.233-27.27-27.27c0.74-18.662,14.654-27.134,27.269-27.134c0.001,0,0.001,0,0.002,0c12.616,0.001,26.531,8.473,27.267,27.073C77.27,65.167,65.036,77.399,50,77.399z" /><path fill="#FF0000" d="M50.002,26.103c-15.946-0.001-23.704,12.486-24.165,24.088C25.838,63.453,36.677,74.292,50,74.292S74.162,63.453,74.162,50.13C73.705,38.591,65.948,26.105,50.002,26.103z" /></g></svg>`,
  "https://chatgpt.com/": `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 83.592 36.743 l -0.032 -0.026 c 1.988 -6.123 1.272 -12.802 -1.972 -18.362 C 76.66 9.819 66.793 5.404 57.162 7.44 l -0.039 0.014 c -4.309 -4.784 -10.451 -7.503 -16.888 -7.473 c -9.857 0 -18.614 6.337 -21.666 15.697 l -0.007 0.041 c -6.297 1.34 -11.723 5.3 -14.916 10.888 c -4.929 8.537 -3.819 19.289 2.761 26.612 l 0.032 0.026 c -1.988 6.123 -1.272 12.803 1.972 18.362 c 4.929 8.537 14.796 12.952 24.427 10.915 l 0.038 -0.014 c 4.309 4.784 10.451 7.503 16.888 7.473 c 9.857 0 18.614 -6.338 21.666 -15.697 l 0.007 -0.04 c 6.297 -1.34 11.723 -5.3 14.916 -10.889 C 91.282 54.819 90.172 44.066 83.592 36.743 z M 53.916 50.129 L 45 55.277 l -8.916 -5.148 V 39.833 L 45 34.686 l 8.916 5.148 V 50.129 z M 76.523 21.28 l -0.041 -0.011 c 1.975 3.42 2.696 7.386 2.043 11.278 L 60.128 21.926 c -0.239 -0.138 -0.489 -0.237 -0.745 -0.303 c -0.751 -0.211 -1.569 -0.112 -2.273 0.294 L 36.1 34.047 l -0.006 -8.862 l 17.355 -10.024 c 1.678 -0.972 3.507 -1.636 5.4 -1.983 l -0.011 -0.038 C 65.661 11.881 72.84 14.925 76.523 21.28 z M 40.236 5.831 l -0.03 0.03 c 3.949 0 7.744 1.358 10.789 3.87 L 32.597 20.353 c -0.239 0.138 -0.449 0.305 -0.635 0.494 c -0.559 0.545 -0.882 1.302 -0.882 2.116 v 24.26 l -7.678 -4.426 l -0.003 -20.041 c -0.002 -1.939 0.337 -3.855 0.983 -5.668 l -0.038 -0.009 C 26.665 10.538 32.89 5.843 40.236 5.831 z M 8.713 29.532 l 0.011 0.041 c 1.975 -3.42 5.049 -6.028 8.746 -7.409 v 21.244 c 0 0.276 0.04 0.542 0.11 0.797 c 0.193 0.756 0.687 1.415 1.391 1.821 l 21.01 12.13 l -7.672 4.437 L 14.95 52.575 c -1.681 -0.968 -3.17 -2.219 -4.417 -3.685 l -0.027 0.028 C 6.004 43.639 5.05 35.899 8.713 29.532 z M 13.477 68.682 l 0.041 0.011 c -1.975 -3.42 -2.696 -7.386 -2.043 -11.278 l 18.398 10.622 c 0.239 0.138 0.489 0.237 0.745 0.303 c 0.751 0.211 1.569 0.113 2.273 -0.294 l 21.01 -12.13 l 0.006 8.862 L 36.552 74.802 c -1.678 0.972 -3.507 1.636 -5.4 1.983 l 0.011 0.038 C 24.339 78.082 17.16 75.038 13.477 68.682 z M 49.764 84.131 l 0.03 -0.03 c -3.949 0 -7.744 -1.358 -10.789 -3.87 L 57.403 69.61 c 0.239 -0.138 0.449 -0.305 0.635 -0.493 c 0.559 -0.545 0.882 -1.302 0.882 -2.116 v -24.26 l 7.678 4.426 l 0.003 20.041 c 0.002 1.939 -0.337 3.855 -0.983 5.668 l 0.038 0.009 C 63.335 79.424 57.11 84.12 49.764 84.131 z M 81.287 60.43 L 81.287 60.43 l -0.011 -0.041 c -1.975 3.42 -5.049 6.028 -8.746 7.409 V 46.554 c 0 -0.276 -0.04 -0.542 -0.11 -0.797 c -0.193 -0.756 -0.687 -1.415 -1.391 -1.822 l -21.01 -12.13 l 7.672 -4.437 L 75.05 37.387 c 1.681 0.968 3.17 2.219 4.417 3.685 l 0.027 -0.028 C 83.996 46.324 84.95 54.063 81.287 60.43 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/></g></svg>`,
  "https://mail.google.com/": `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"><path d="M 6.136 78.759 h 14.318 V 43.986 L 0 28.645 v 43.977 C 0 76.018 2.751 78.759 6.136 78.759" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(66,133,244); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 69.545 78.759 h 14.318 c 3.395 0 6.136 -2.751 6.136 -6.136 V 28.645 L 69.545 43.986" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(52,168,83); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 69.545 17.395 v 26.591 L 90 28.645 v -8.182 c 0 -7.589 -8.662 -11.915 -14.727 -7.364" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(251,188,4); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 20.455 43.986 V 17.395 L 45 35.804 l 24.545 -18.409 v 26.591 L 45 62.395" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(234,67,53); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/><path d="M 0 20.463 v 8.182 l 20.455 15.341 V 17.395 L 14.727 13.1 C 8.652 8.548 0 12.875 0 20.463" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(197,34,31); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/></g></svg>`,
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
