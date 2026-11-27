(() => {
  try {
    const saved = localStorage.getItem("northline-theme");
    if (saved === "dark" || saved === "retro") {
      document.documentElement.classList.add(saved);
    }
  } catch {
    // ignore storage access issues
  }
})();
