// script.js — CipherLab Pro final: results only on Process, full wiring & persistence
(function () {
  const $ = id => document.getElementById(id);
  const THEME_KEY = "cipherlab_light_mode";

  /* toast */
  const toastEl = $("toast");
  function showToast(msg, ttl = 1400) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove("show"), ttl);
  }

  function mod(n, m) { return ((n % m) + m) % m; }

  function shiftLetter(ch, shift, preserveCase) {
    const A = 65, a = 97;
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      const r = mod(code - A + shift, 26) + A;
      return preserveCase ? String.fromCharCode(r) : String.fromCharCode(r + 32);
    }
    if (code >= 97 && code <= 122) {
      const r = mod(code - a + shift, 26) + a;
      return String.fromCharCode(r);
    }
    return ch;
  }

  function caesar(text, shift, opts = { preserveCase: true, preservePunct: true }) {
    let out = "";
    for (let ch of text) {
      if (/[A-Za-z]/.test(ch)) out += shiftLetter(ch, shift, !!opts.preserveCase);
      else out += opts.preservePunct ? ch : ch;
    }
    return out;
  }

  function copyText(text) {
    if (!text) return Promise.reject(new Error("empty"));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) resolve(); else reject(new Error("copy failed"));
      } catch (e) {
        try { document.body.removeChild(ta); } catch {}
        reject(e);
      }
    });
  }

  function saveTheme(isLight) {
    try { localStorage.setItem(THEME_KEY, isLight ? "1" : "0"); } catch (e) {}
  }
  function readTheme() {
    try {
      const v = localStorage.getItem(THEME_KEY);
      if (v === "1") return true;
      if (v === "0") return false;
    } catch (e) {}
    return false; // default dark
  }
  function applyTheme(isLight) {
    document.documentElement.classList.toggle("light", !!isLight);
    const label = $("themeLabel");
    if (label) label.textContent = isLight ? "Light Mode" : "Dark Mode";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const input = $("textInput");
    const output = $("output");
    const shiftEl = $("shiftInput");
    const shiftValue = $("shiftValue");
    const outLen = $("outLen");
    const previewShort = $("previewShort");
    const processBtn = $("processBtn");
    const clearBtn = $("clearBtn");
    const copyBtn = $("copyBtn");
    const swapBtn = $("swapBtn");
    const themeToggle = $("themeToggle");
    const themeLabel = $("themeLabel");

    if (!input || !output || !shiftEl) return;

    function getOptions() {
      return { preserveCase: !!$("preserveCase").checked, preservePunct: !!$("preservePunct").checked };
    }
    function getMode() { const sel = document.querySelector('input[name="mode"]:checked'); return sel ? sel.value : "encrypt"; }

    function computeAndRender({ focus = false } = {}) {
      const txt = input.value || "";
      const s = parseInt(shiftEl.value, 10) || 0;
      const rawShift = getMode() === "encrypt" ? s : -s;
      const opts = getOptions();
      const result = caesar(txt, rawShift, opts);
      output.textContent = result;
      outLen.textContent = result.length;
      previewShort.textContent = result.slice(0, 40) || "—";
      if (focus) output.focus();
    }

    // theme init from storage
    const isLight = readTheme();
    applyTheme(isLight);
    if (themeToggle) themeToggle.checked = isLight;

    if (themeToggle) {
      themeToggle.addEventListener("change", (e) => {
        const val = !!e.target.checked;
        applyTheme(val);
        saveTheme(val);
        showToast(val ? "Light mode" : "Dark mode");
      });
    }

    // initial UI sync (no auto processing)
    shiftValue.textContent = shiftEl.value;
    outLen.textContent = "0";
    previewShort.textContent = "—";

    // pills toggle (visual only; does NOT auto-process)
    document.querySelectorAll(".pill").forEach(p => {
      p.addEventListener("click", () => {
        document.querySelectorAll(".pill").forEach(x => x.classList.remove("active"));
        p.classList.add("active");
        const inp = p.querySelector('input[type="radio"]');
        if (inp) inp.checked = true;
        // do not auto compute — user must press Process
      });
    });

    // shift UI update (value shown), but does NOT auto-process
    shiftEl.addEventListener("input", () => { shiftValue.textContent = shiftEl.value; });

    // Process button: the only place that computes & renders
    processBtn.addEventListener("click", () => computeAndRender({ focus: true }));

    // keyboard shortcut to trigger Process (Ctrl+Enter)
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        computeAndRender({ focus: true });
      }
    });

    // Clear
    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.textContent = "";
      outLen.textContent = "0";
      previewShort.textContent = "—";
      showToast("Cleared");
    });

    // Copy with fallback
    copyBtn.addEventListener("click", () => {
      const txt = output.textContent || "";
      if (!txt) return showToast("Nothing to copy");
      copyText(txt).then(() => showToast("Copied")).catch(() => showToast("Copy failed"));
    });

    // Swap: swaps input and output, does NOT auto-process after swap
    swapBtn.addEventListener("click", () => {
      const tmp = input.value;
      input.value = output.textContent || "";
      output.textContent = tmp || "";
      outLen.textContent = output.textContent.length;
      previewShort.textContent = output.textContent.slice(0, 40) || "—";
      showToast("Swapped");
    });

    // Click output to focus + select
    output.addEventListener("click", () => {
      output.focus();
      try {
        const range = document.createRange();
        range.selectNodeContents(output);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (e) {}
    });
  });
})();
