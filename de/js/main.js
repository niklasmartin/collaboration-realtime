(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const containers = document.querySelectorAll('.animation-container');

  containers.forEach((container) => {
    const sceneId = container.dataset.scene;
    const scene = window.scenes && window.scenes[sceneId];

    if (!scene) {
      container.textContent = sceneId + ' — Szene noch nicht implementiert';
      return;
    }

    const renderer = new window.Renderer(container);

    if (prefersReducedMotion) {
      container.classList.add('reduced-motion');
      // Render the scene's final resting state as a single static frame
      // instead of animating — still fully representative of the scene.
      const finalState = scene.sceneState(scene.duration);
      renderer.render(Object.assign({ globalOpacity: 1 }, finalState));
      return;
    }

    const runner = new window.Timeline.SceneRunner(scene, {
      onFrame: (frame) => renderer.render(frame),
    });

    // Debug hook only — lets tooling (e.g. deterministic screenshot capture)
    // call `container.__runner.seek(ms)` to jump to an exact frame without
    // fighting real-time rAF drift. Not read anywhere in production code.
    container.__runner = runner;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runner.start();
          } else {
            runner.stop();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
  });
})();
