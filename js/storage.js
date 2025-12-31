export const KEYS = {
  MODE: "wallpaper_mode",
  SOLID: "wallpaper_solid_color",
  NEXT: "wallpaper_next_url",
  SHORTCUTS: "shortcuts_list_v1",
};

export const Storage = {
  getRaw(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setRaw(key, value) {
    try {
      if (value === null || value === undefined) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) {
      // noop
    }
  },
  getJSON(key) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  },
  setJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // noop
    }
  },
};
