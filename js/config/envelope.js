// in MS
// https://en.wikipedia.org/wiki/Envelope_(music)#ADSR
const envelope = {
  attack: 0.0,
  decay: 0,
  sustain: 0.2,
  release: 0.2,
};

const getEnvelopeTotalTime = () => {
  return Object.values(envelope).reduce((total, val) => total + val, 0);
};

export { envelope, getEnvelopeTotalTime };
