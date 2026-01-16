export function initClock() {
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");

    const timeString = `${hours}:${minutes}`;
    const el = document.getElementById("clock");
    if (el) el.textContent = timeString;
  }

  updateClock();
  // We only need minute resolution for this UI.
  setInterval(updateClock, 30_000);
}
