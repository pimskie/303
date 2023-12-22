import { context } from './destination';

const createLowPassFilter = () => {
  const lowPass = new BiquadFilterNode(context, {
    type: 'lowpass',
    frequency: 200,
  });

  return lowPass;
};

export { createLowPassFilter };
