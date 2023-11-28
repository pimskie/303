import { context, destination } from '@/audioNodes/destination';
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
].map((tone) => {
  const gain = new GainNode(context);
  gain.connect(destination);
  gain.gain.value = 0;

  return {
    ...tone,
    gain,
  };
});

const createOscillator = ({ type, frequency, octave }, detune = 0) => {
  const oscillator = new OscillatorNode(context, {
    frequency: frequency * octaves.get(parseInt(octave)),
    type,
    detune,
  });

  return oscillator;
};

const playTone = (tone) => {
  const { currentTime: now } = context;
  const oscillator = createOscillator(tone);
  const oscillator2 = createOscillator(
    {
      ...tone,
      type: 'sawtooth',
    },
    10,
  );
  const oscillator3 = createOscillator(
    {
      ...tone,
      type: 'sawtooth',
    },
    -10,
  );

  const gain = new GainNode(context);

  const lfo = new OscillatorNode(context, {
    type: 'sawtooth',
    frequency: 5,
  });

  const lfoGain = new GainNode(context);
  lfoGain.gain.setValueAtTime(1, now);

  const envelopeTime = getEnvelopeTotalTime();

  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  lfoGain.connect(oscillator2.frequency);
  lfoGain.connect(oscillator3.frequency);
  oscillator.connect(gain);
  oscillator2.connect(gain);
  oscillator3.connect(gain);

  gain.connect(destination);
  gain.gain.value = 0;

  // `linearRampToValueAtTime`: The change starts at the time specified for the previous event
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + envelope.attack);
  gain.gain.linearRampToValueAtTime(1, now + envelope.attack + envelope.decay);
  gain.gain.setValueAtTime(
    1,
    now + envelope.attack + envelope.decay + envelope.sustain,
  );
  gain.gain.linearRampToValueAtTime(
    0,
    now +
      envelope.attack +
      envelope.decay +
      envelope.sustain +
      envelope.release,
  );

  oscillator.start();
  oscillator2.start();
  oscillator3.start();
  oscillator.stop(now + envelopeTime);
  oscillator2.stop(now + envelopeTime);
  oscillator3.stop(now + envelopeTime);

  lfo.start();
  lfo.stop(now + envelopeTime);
};

export { tones, playTone };
