// timeline.js — pure, deterministic keyframe engine.
//
// Everything in this file is a pure function of time: given an `elapsed`
// millisecond value, `Track#valueAt(elapsed)` always returns the same
// answer. No mutation, no accumulation of past events. This is what makes
// scrubbing, looping, screenshots, and reduced-motion static frames all
// trivially correct — they just call the same function with a different
// number.
//
// SceneRunner (below) is the only stateful piece: it owns a clock and
// drives a requestAnimationFrame loop that repeatedly calls the pure
// `scene.sceneState(elapsed)` function and hands the result to a renderer.

(function (root) {
  'use strict';

  // ---------------------------------------------------------------------
  // Easing
  // ---------------------------------------------------------------------

  const Easing = {
    linear: (t) => t,
    // cubic ease-in-out
    easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    // very subtle ease-out — used for things that should barely decelerate
    easeOutSubtle: (t) => 1 - Math.pow(1 - t, 1.6),
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /**
   * Point along a slightly-arced path between `from` and `to`. The arc is a
   * perpendicular bulge that peaks at the midpoint (sin curve) — a cheap,
   * good-looking stand-in for a quadratic bezier control point, without
   * needing a separate control-point authoring step.
   */
  function arcPoint(from, to, t, arc) {
    const x = lerp(from.x, to.x, t);
    const y = lerp(from.y, to.y, t);
    if (!arc) return { x, y };
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const bulge = Math.sin(t * Math.PI) * arc;
    return { x: x + nx * bulge, y: y + ny * bulge };
  }

  // ---------------------------------------------------------------------
  // Track — a single animated property, expressed as keyframes.
  // ---------------------------------------------------------------------
  //
  // kind:
  //   'linear' — numeric value, interpolated with easing between keyframes
  //   'vector' — { x, y } value, interpolated with easing + optional arc
  //   'step'   — any value, held constant from its keyframe until the next
  //
  // Before the first keyframe, the first keyframe's value is held.
  // After the last keyframe, the last keyframe's value is held.

  class Track {
    constructor(kind, defaultValue) {
      this.kind = kind;
      this.defaultValue = defaultValue;
      this.keyframes = [];
      this._sorted = true;
    }

    addKeyframe(at, value, opts) {
      opts = opts || {};
      this.keyframes.push({
        at,
        value,
        easing: opts.easing || 'easeInOut',
        arc: opts.arc || 0,
      });
      this._sorted = false;
      return this;
    }

    _ensureSorted() {
      if (!this._sorted) {
        this.keyframes.sort((a, b) => a.at - b.at);
        this._sorted = true;
      }
    }

    valueAt(elapsed) {
      this._ensureSorted();
      const kfs = this.keyframes;
      if (kfs.length === 0) return this.defaultValue;

      if (elapsed <= kfs[0].at) {
        return this.kind === 'vector' ? { ...kfs[0].value } : kfs[0].value;
      }

      let i = 0;
      while (i < kfs.length - 1 && elapsed >= kfs[i + 1].at) i++;

      if (i >= kfs.length - 1) {
        const last = kfs[kfs.length - 1];
        return this.kind === 'vector' ? { ...last.value } : last.value;
      }

      const k0 = kfs[i];
      const k1 = kfs[i + 1];

      if (this.kind === 'step') return k0.value;

      const span = k1.at - k0.at;
      const rawT = span <= 0 ? 1 : (elapsed - k0.at) / span;
      const easeFn = Easing[k1.easing] || Easing.easeInOut;
      const t = easeFn(clamp(rawT, 0, 1));

      if (this.kind === 'linear') return lerp(k0.value, k1.value, t);
      if (this.kind === 'vector') return arcPoint(k0.value, k1.value, t, k1.arc);

      return k0.value;
    }
  }

  // ---------------------------------------------------------------------
  // SceneRunner — drives a pure scene with a requestAnimationFrame clock.
  // ---------------------------------------------------------------------
  //
  // A "scene" is: { duration, fadeDuration, sceneState(elapsed) }.
  // sceneState(elapsed) must be pure and defined for any elapsed in
  // [0, duration].
  //
  // The runner loops [0, duration] as the "active" animation, then holds the
  // resting frame (sceneState(duration)) while fading globalOpacity down to
  // 0 over `fadeDuration` ms, then wraps back to 0 — a gentle fade-to-reset
  // rather than a hard jump. Total loop length is duration + fadeDuration.

  class SceneRunner {
    constructor(scene, options) {
      options = options || {};
      this.scene = scene;
      this.fadeDuration = scene.fadeDuration != null ? scene.fadeDuration : 400;
      this.totalLoop = scene.duration + this.fadeDuration;
      this.onFrame = options.onFrame || null;
      this.now = options.now || (() => (typeof performance !== 'undefined' ? performance.now() : Date.now()));

      this.elapsed = 0;
      this.running = false;
      this.paused = false;
      this._lastTime = 0;
      this._rafId = null;
      // Bind to the global object — native requestAnimationFrame/cancelAnimationFrame
      // throw "Illegal invocation" in some browsers (e.g. Chrome) when called with
      // a `this` receiver other than `window`, which happens if the bare function
      // reference is stored and invoked as `this._raf(...)`.
      this._raf = options.raf || (typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame.bind(window) : null);
      this._caf = options.caf || (typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame.bind(window) : null);

      this._onVisibility = () => {
        if (typeof document !== 'undefined' && document.hidden) {
          this.pause();
        } else {
          this.resume();
        }
      };
      if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('visibilitychange', this._onVisibility);
      }
    }

    /** Compute the rendered frame (state + globalOpacity) for a loop-relative elapsed time. */
    computeFrame(loopElapsed) {
      const d = this.scene.duration;
      if (loopElapsed <= d) {
        const state = this.scene.sceneState(loopElapsed);
        return Object.assign({ globalOpacity: 1 }, state);
      }
      const state = this.scene.sceneState(d);
      const ft = clamp((loopElapsed - d) / this.fadeDuration, 0, 1);
      const opacity = 1 - Easing.easeInOut(ft);
      return Object.assign({ globalOpacity: opacity }, state);
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.paused = false;
      this._lastTime = this.now();
      if (this._raf) this._rafId = this._raf((t) => this._tick(t));
    }

    stop() {
      this.running = false;
      if (this._rafId != null && this._caf) this._caf(this._rafId);
      this._rafId = null;
    }

    pause() {
      this.paused = true;
    }

    resume() {
      if (!this.running) return;
      if (this.paused) {
        this._lastTime = this.now();
        this.paused = false;
      }
    }

    /** Jump directly to an elapsed time (loop-relative) and render — for debugging/screenshots. */
    seek(ms) {
      this.elapsed = clamp(ms, 0, this.totalLoop);
      const frame = this.computeFrame(this.elapsed);
      if (this.onFrame) this.onFrame(frame, this.elapsed, this.totalLoop);
      return frame;
    }

    _tick(t) {
      if (!this.running) return;
      const dt = t - this._lastTime;
      this._lastTime = t;

      if (!this.paused) {
        this.elapsed += dt;
        if (this.elapsed >= this.totalLoop) {
          // wrap, preserving remainder — never a hard snap that skips time
          this.elapsed = this.elapsed % this.totalLoop;
        }
      }

      const frame = this.computeFrame(this.elapsed);
      if (this.onFrame) this.onFrame(frame, this.elapsed, this.totalLoop);

      if (this._raf) this._rafId = this._raf((next) => this._tick(next));
    }

    destroy() {
      this.stop();
      this.onFrame = null;
      if (typeof document !== 'undefined' && document.removeEventListener) {
        document.removeEventListener('visibilitychange', this._onVisibility);
      }
    }
  }

  const Timeline = { Easing, Track, clamp, lerp, arcPoint, SceneRunner };

  if (root) root.Timeline = Timeline;
  if (typeof module !== 'undefined' && module.exports) module.exports = Timeline;
})(typeof window !== 'undefined' ? window : null);
