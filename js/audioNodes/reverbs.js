import { context } from './destination';

const reverbName = 'lodge.wav';

const loadReverb = async () => {
  const path = `/sounds/reverbs/${reverbName}`;
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  const decodedAudio = await context.decodeAudioData(arrayBuffer);

  return decodedAudio;
};

export { loadReverb };
