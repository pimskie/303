import { context, destination } from '@/audioNodes/destination';
import { createLowPassFilter } from '@/audioNodes/lowPassFilter';
import { envelope, getEnvelopeTotalTime } from '@/config/envelope';
import { octaves } from '@/config/octaves';

const tones = [
  {
    label: 'C',
    id: 'c',
    frequency: 32.703195662574829,
    type: 'sawtooth',
    octave: 2,
  },
  {
    label: 'D',
    id: 'D',
    frequency: 36.708095989675945,
    type: 'sawtooth',
    octave: 2,
  },
  {
    label: 'E',
    id: 'e',
    frequency: 41.203444614108741,
    type: 'sawtooth',
    octave: 2,
  },
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

const createOscillator = ({ type, frequency, octave }, { detune = 0 } = {}) => {
  const oscillator = new OscillatorNode(context, {
    frequency: frequency * octaves.get(parseInt(octave)),
    type,
    detune,
  });

  return oscillator;
};

const createLFO = (options = { type: 'sawtooth', frequency: 100 }) => {
  return new OscillatorNode(context, options);
};

const playTone = (tone) => {
  const { currentTime: now } = context;

  const oscillator = createOscillator(tone);
  const lowPassFilter = createLowPassFilter();

  console.log(lowPassFilter);

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
  lfoGain.gain.setValueAtTime(1, now);

  const envelopeTime = getEnvelopeTotalTime();
  const envelopeGain = new GainNode(context);

  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  lfoGain.connect(oscillator2.frequency);
  lfoGain.connect(oscillator3.frequency);

  oscillator.connect(lowPassFilter);
  oscillator2.connect(lowPassFilter);
  oscillator3.connect(lowPassFilter);

  lowPassFilter.connect(envelopeGain);
  envelopeGain.connect(destination);

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
};

export { tones, playTone };
