import { context, destination } from '@/audioNodes/destination';
import { createLowPassFilter } from '@/audioNodes/lowPassFilter';
import { loadReverb } from '@/audioNodes/reverbs';
import { createNoise } from '@/audioNodes/noise';

import { envelope, getEnvelopeTotalTime } from '@/config/envelope';
import { octaves } from '@/config/octaves';
import { waveOptions } from '@/config/waves/wurlitzer';

const reverbs = [];
const wave = new PeriodicWave(context, waveOptions);

const loadReverbs = async () => {
  const audioBuffer = await loadReverb();

  reverbs.push(audioBuffer);
};

const tones = [
  {
    label: 'C',
    id: 'c',
    frequency: 60.703195662574829,
    // frequency: 32.703195662574829,
    type: 'square',
    wave,
    octave: 2,
  },
  // {
  //   label: 'D',
  //   id: 'D',
  //   frequency: 36.708095989675945,
  //   type: 'sine',
  //   wave,
  //   octave: 2,
  // },
  // {
  //   label: 'E',
  //   id: 'e',
  //   frequency: 41.203444614108741,
  //   type: 'sine',
  //   wave,
  //   octave: 2,
  // },
]
  .sort((a, b) => b.frequency - a.frequency)
  .map((tone) => {
    const gain = new GainNode(context);
    gain.connect(destination);
    gain.gain.value = 0;

    return {
      ...tone,
      gain,
    };
  });

const createOscillator = (
  { type, frequency, octave, wave },
  { detune = 0 } = {},
) => {
  const oscillator = new OscillatorNode(context, {
    frequency: frequency * octaves.get(parseInt(octave)),
    type,
    detune,
  });

  return oscillator;
};

const createLFO = (options = { type: 'sawtooth', frequency: 0.5 }) =>
  new OscillatorNode(context, options);

const playTone = (tone) => {
  const { currentTime: now } = context;

  const oscillator = createOscillator(tone);
  const lowPassFilter = createLowPassFilter();
  const noise = createNoise();

  const oscillator2 = createOscillator(
    {
      ...tone,
      type: 'sawtooth',
    },
    { detune: 10 },
  );

  const oscillator3 = createOscillator(
    {
      ...tone,
      type: 'sawtooth',
    },
    { detune: -10 },
  );

  const lfo = createLFO();

  const lfoGain = new GainNode(context);
  lfoGain.gain.setValueAtTime(10, now);

  const envelopeTime = getEnvelopeTotalTime();
  const envelopeGain = new GainNode(context);

  const convolver = new ConvolverNode(context, { buffer: reverbs[0] });

  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.detune);
  lfoGain.connect(oscillator2.detune);
  lfoGain.connect(oscillator3.detune);

  oscillator.connect(lowPassFilter);
  oscillator2.connect(lowPassFilter);
  oscillator3.connect(lowPassFilter);

  noise.connect(lowPassFilter);

  lowPassFilter.connect(envelopeGain);
  envelopeGain.connect(destination);
  // convolver.connect(destination);

  // `linearRampToValueAtTime`: The change starts at the time specified for the previous event
  envelopeGain.gain.setValueAtTime(0, now);
  envelopeGain.gain.linearRampToValueAtTime(1, now + envelope.attack);
  envelopeGain.gain.linearRampToValueAtTime(
    1,
    now + envelope.attack + envelope.decay,
  );
  envelopeGain.gain.setValueAtTime(
    1,
    now + envelope.attack + envelope.decay + envelope.sustain,
  );
  envelopeGain.gain.linearRampToValueAtTime(
    0,
    now +
      envelope.attack +
      envelope.decay +
      envelope.sustain +
      envelope.release,
  );

  oscillator.start();
  oscillator.stop(now + envelopeTime);

  oscillator2.start();
  oscillator2.stop(now + envelopeTime);

  oscillator3.start();
  oscillator3.stop(now + envelopeTime);

  lfo.start();
  lfo.stop(now + envelopeTime);

  noise.start();
  noise.stop(now + 0.5);
};

export { tones, playTone, loadReverbs };
