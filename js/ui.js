import wallpaper from './wallpaper.js';
import { Storage, KEYS } from './storage.js';

export function initUI() {
  const settingsBtn = document.getElementById("settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  const closeSettingsBtn = document.getElementById("close-settings");
  const bgModeInputs = document.querySelectorAll('input[name="bg-mode"]');
  const colorSwatches = document.querySelectorAll(".color-swatch");

  // Toggle Panel
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

  // Initialize UI state from storage
  const currentMode = Storage.getRaw(KEYS.MODE) || 'online';
  const modeInput = document.querySelector(`input[name="bg-mode"][value="${currentMode}"]`);
  if (modeInput) modeInput.checked = true;

  const currentSolidColor = Storage.getRaw(KEYS.SOLID) || '#3b3b3f';
  colorSwatches.forEach((sw) => {
    if (sw.getAttribute('data-color') === currentSolidColor) sw.classList.add('active');
    else sw.classList.remove('active');
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
        wallpaper.setMode('solid');
      }
    });
  });

  // Subtle tilt interaction for shortcut cards
  const shortcutCards = document.querySelectorAll('.shortcut-card');
  if (!('ontouchstart' in window)) {
    shortcutCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * 6; // rotateX
        const ry = (px - 0.5) * -6; // rotateY
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.03)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}
