import { context } from './destination';

const noiseBuffer = context.createBuffer(
  1,
  context.sampleRate * 1,
  context.sampleRate,
);

const data = noiseBuffer.getChannelData(0);

for (let i = 0; i < noiseBuffer.length; i++) {
  data[i] = Math.random() * 2 - 1;
}

const createNoise = () => {
  const noise = context.createBufferSource();

  noise.buffer = noiseBuffer;

  return noise;
};

export { createNoise };
