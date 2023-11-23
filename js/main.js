// https://roland50.studio/
// https://medium.com/geekculture/building-a-modular-synth-with-web-audio-api-and-javascript-d38ccdeca9ea
// https://russellgood.com/js-synthesizer-part-3-multi-octave-keyboard/

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
  const bpm = 60;

  if (shouldUpdate(bpm)) {
    executeStep();
  }

  rafId = requestAnimationFrame(loop);
};

toggleElement.addEventListener('click', () => {
  isOn = !isOn;

  toggleElement.isOn = isOn;

  if (isOn) {
    executeStep();

    loop();
  } else {
    rackElement.reset();
    cancelAnimationFrame(rafId);
  }
});
