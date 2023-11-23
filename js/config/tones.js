import { context, destination } from '@/audioNodes/destination';

// dumb mofo
const octaves = new Map([
  [1, 1],
  [2, 2],
  [3, 4],
  [4, 8],
  [5, 16],
  [6, 32],
  [7, 64],
]);

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

const createOscillator = ({ type, frequency, octave }) => {
  const oscillator = new OscillatorNode(context, {
    frequency: frequency * octaves.get(parseInt(octave)),
    type,
  });

  return oscillator;
};

const playTone = (tone) => {
  const { currentTime: now } = context;
  const oscillator = createOscillator(tone);
  const oscillator2 = createOscillator({
    ...tone,
    type: 'sawtooth',
    frequency: tone.frequency * 0.99,
  });
  const gain = new GainNode(context);

  const lfo = new OscillatorNode(context, {
    type: 'sawtooth',
    frequency: 5,
  });

  const lfoGain = new GainNode(context);
  lfoGain.gain.setValueAtTime(1, now);

  // in MS
  // https://en.wikipedia.org/wiki/Envelope_(music)#ADSR
  const envelope = {
    attack: 0.2,
    decay: 0,
    sustain: 0.2,
    release: 0.5,
  };

  const envelopeTime = Object.values(envelope).reduce(
    (total, val) => total + val,
    0,
  );

  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  lfoGain.connect(oscillator2.frequency);
  oscillator.connect(gain);
  oscillator2.connect(gain);

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
  oscillator.stop(now + envelopeTime);
  oscillator2.stop(now + envelopeTime);

  lfo.start();
  lfo.stop(now + envelopeTime);
};

export { tones, playTone };
