const FAVICONS = {
  chrome: "icons/chrome.svg",
  firefox: "icons/firefox.svg",
  brave: "icons/brave.svg",
  edge: "icons/edge.svg",
  generic: "icons/safari.svg",
};

export async function initFavicon() {
  const favicon = document.getElementById("favicon");
  if (!favicon) return;

  const ua = navigator.userAgent;
  let icon = FAVICONS.generic;

  try {
    if (navigator.brave && (await navigator.brave.isBrave())) {
      icon = FAVICONS.brave;
    } else if (ua.indexOf("Firefox") > -1) {
      icon = FAVICONS.firefox;
    } else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) {
      icon = FAVICONS.chrome;
    } else if (ua.indexOf("Edg") > -1) {
      icon = FAVICONS.edge;
    }
  } catch (e) {
    // Ignore detection errors
  }

  favicon.href = icon;
}
