// https://roland50.studio/
import './components/rack';
import './components/controls/toggle';

import { shouldUpdate } from '@/utils/timer';

let rafId = null;
let isOn = false;
const rackElement = document.querySelector('p-rack');
const toggleElement = document.querySelector('p-toggle');

const executeStep = () => {
  rackElement.nextStep();
};

const loop = () => {
  const bpm = 130;

  if (shouldUpdate(bpm)) {
    executeStep();
  }

  rafId = requestAnimationFrame(loop);
};

toggleElement.addEventListener('click', () => {
  isOn = !isOn;

  toggleElement.isOn = isOn;

  if (isOn) {
    loop();
  } else {
    rackElement.reset();
    cancelAnimationFrame(rafId);
  }
});
