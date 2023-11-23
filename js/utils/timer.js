let rafId = null;
let currentTime = null;
let previousTime = null;

const shouldUpdate = (bpm) => {
  const updateMS = (60 / bpm) * 1000;

  if (!previousTime) {
    previousTime = performance.now();

    return false;
  }

  const currentTime = performance.now();

  if (currentTime - previousTime >= updateMS) {
    previousTime = performance.now();

    return true;
  }

  return false;
};

export { shouldUpdate };
