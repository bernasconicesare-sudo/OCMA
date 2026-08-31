const wordmark = document.querySelector(".ocma-wordmark");
const letters = [...document.querySelectorAll(".ocma-letter")];
const reveal = document.querySelector(".word-reveal");
const revealText = document.querySelector(".word-reveal-inner");
const heroCenter = document.querySelector(".hero-center");

let isEntering = false;
let fadeTicking = false;
let fadeItems = [];

function activate(index) {
  const letter = letters[index];

  if (
    !letter ||
    document.body.classList.contains("entered-home") ||
    isEntering
  ) return;

  wordmark.dataset.active = String(index);
  revealText.textContent = `[*${letter.dataset.word}]`;
  reveal.classList.add("is-visible");
}

function clearActive() {
  if (
    document.body.classList.contains("entered-home") ||
    isEntering
  ) return;

  delete wordmark.dataset.active;
  reveal.classList.remove("is-visible");
}

function prepareViewportFade() {
  fadeItems = [...document.querySelectorAll(".viewport-fade")];
  updateViewportFade();
}

function updateViewportFade() {
  if (!document.body.classList.contains("entered-home") || !fadeItems.length) {
    fadeTicking = false;
    return;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportCenter = viewportHeight / 2;
  const fullZone = viewportHeight * 0.10;
  const fadeZone = viewportHeight * 0.42;

  fadeItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - viewportCenter);

    let opacity;

    if (distance <= fullZone) {
      opacity = 1;
    } else {
      const t = Math.min(1, (distance - fullZone) / fadeZone);
      opacity = 1 - (t * 0.94);
    }

    opacity = Math.max(0.06, Math.min(1, opacity));

    const direction = itemCenter < viewportCenter ? -1 : 1;
    const transformAmount = (1 - opacity) * 10 * direction;

    item.style.opacity = opacity.toFixed(3);
    item.style.transform = `translateY(${transformAmount.toFixed(2)}px)`;
  });

  fadeTicking = false;
}

function requestViewportFade() {
  if (fadeTicking) return;
  fadeTicking = true;
  requestAnimationFrame(updateViewportFade);
}

function updateAboutVisibility() {
  if (!document.body.classList.contains("home-from-splash")) return;

  if (window.scrollY > 12) {
    document.body.classList.add("about-visible");
  } else {
    document.body.classList.remove("about-visible");
  }
}

function enterHome() {
  if (document.body.classList.contains("entered-home") || isEntering) return;

  isEntering = true;

  delete wordmark.dataset.active;
  reveal.classList.remove("is-visible");
  heroCenter.classList.add("is-leaving");

  setTimeout(() => {
    heroCenter.classList.remove("is-leaving");

    document.body.classList.add("entered-home", "home-from-splash");
    document.body.classList.remove("about-visible");

    isEntering = false;

    prepareViewportFade();

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    requestAnimationFrame(updateViewportFade);
  }, 850);
}

function enterDirectlyFromHash() {
  const hash = window.location.hash;

  if (hash !== "#about" && hash !== "#contact") return false;

  document.body.classList.add("entered-home", "direct-entry", "about-visible");

  prepareViewportFade();

  requestAnimationFrame(() => {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({
        behavior: "instant",
        block: "start"
      });
    }

    requestAnimationFrame(updateViewportFade);
  });

  return true;
}

/* If the page was opened from Projects with #about or #contact,
   bypass the black OCMA splash completely. */
const directEntry = enterDirectlyFromHash();

if (!directEntry) {
  letters.forEach((letter, index) => {
    letter.addEventListener("mouseenter", () => activate(index));
    letter.addEventListener("focus", () => activate(index));
    letter.addEventListener("mouseleave", clearActive);
    letter.addEventListener("blur", clearActive);
    letter.addEventListener("click", enterHome);
  });

  wordmark.addEventListener("mouseleave", clearActive);
}

window.addEventListener("scroll", () => {
  updateAboutVisibility();
  requestViewportFade();
}, { passive: true });

window.addEventListener("resize", requestViewportFade);

/* Handle hash navigation performed while already on index.html. */
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;

  if (
    (hash === "#about" || hash === "#contact") &&
    !document.body.classList.contains("entered-home")
  ) {
    enterDirectlyFromHash();
  } else {
    requestViewportFade();
  }
});
