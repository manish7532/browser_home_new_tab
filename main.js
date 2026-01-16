import wallpaper from "./js/wallpaper.js";
import { initClock } from "./js/clock.js";
import { initFavicon } from "./js/favicon.js";
import { initUI } from "./js/ui.js";

// Entry
async function main() {
  initClock();
  await wallpaper.init();
  initUI();
  initFavicon();
}

main();
