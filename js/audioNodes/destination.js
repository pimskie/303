const context = new AudioContext();
const destination = context.destination;
const mainVolume = new GainNode(context);

mainVolume.connect(destination);

export { context, mainVolume, destination };
