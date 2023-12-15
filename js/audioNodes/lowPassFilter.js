import { context } from './destination';

const createLowPassFilter = () => {
  const lowPass = new BiquadFilterNode(context, {
    type: 'lowpass',
    frequency: 400,
    Q: 5,
  });

  return lowPass;
};

export { createLowPassFilter };
