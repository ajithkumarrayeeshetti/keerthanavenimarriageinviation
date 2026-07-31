import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const sceneInput = {
  /** 0–1 progress through the current page's scrollable height. */
  scrollProgress: 0,
  /** Normalized mouse position, -1..1, origin at viewport center. */
  mouseX: 0,
  mouseY: 0,
  /** Timestamp (ms) of the last RSVP-submit "fly-through" trigger, or null. */
  submitPulseAt: null as number | null,
};

/** Called when the RSVP form is successfully submitted — the camera rig
 *  reads this to do a brief dramatic push-in before settling back down. */
export function triggerSubmitPulse() {
  sceneInput.submitPulseAt = performance.now();
}

let currentTrigger: ScrollTrigger | null = null;

/**
 * (Re)creates a non-pinning ScrollTrigger that just tracks how far the
 * guest has scrolled down the current page (0 = top, 1 = bottom) and
 * writes it into sceneInput.scrollProgress. No layout/pinning side
 * effects — purely an observer, so it can never interfere with normal
 * page scrolling, forms, or navigation.
 */
export function initScrollTracking() {
  currentTrigger?.kill();
  currentTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      sceneInput.scrollProgress = self.progress;
    },
  });
}

/** Call after route changes, once the new page has rendered, so
 *  ScrollTrigger recalculates against the new document height. */
export function refreshScrollTracking() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    sceneInput.scrollProgress = 0;
  });
}

let mouseListenerAttached = false;
export function initMouseTracking() {
  if (mouseListenerAttached || typeof window === "undefined") return;
  mouseListenerAttached = true;
  window.addEventListener(
    "mousemove",
    (e) => {
      sceneInput.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneInput.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );
}
