import { context, destination } from '@/audioNodes/destination';

const createGain = () => new GainNode(context);

const createOscillator = ({ type, frequency }) => {
  const oscillator = new OscillatorNode(context, {
    frequency,
    type,
  });

  return oscillator;
};

const tones = [
  {
    label: 'A',
    id: 'a',
    frequency: 300,
    type: 'sine',
  },
  {
    label: 'B',
    id: 'b',
    frequency: 500,
    type: 'sine',
  },
  {
    label: 'C',
    id: 'c',
    frequency: 277.183,
    type: 'sine',
  },
].map((tone) => {
  const gain = createGain();
  gain.connect(destination);
  gain.gain.value = 0;

  return {
    ...tone,
    gain,
  };
});

const playTone = (tone) => {
  const { gain } = tone;
  const oscillator = createOscillator(tone);

  oscillator.connect(tone.gain);

  gain.gain.value = 0;
  oscillator.start();

  gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.1);
  gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.2);
};

export { tones, playTone };
