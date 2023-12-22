const playExample = () => {
  // AudioContext initialiseren
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Sinusoscillator voor de diepe bas
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine'; // Sinusgolf voor de bas
  oscillator.frequency.setValueAtTime(60, audioContext.currentTime); // Lage frequentie voor de kick

  // Ruisgenerator voor extra textuur
  const noiseBuffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * 1,
    audioContext.sampleRate,
  );

  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseBuffer.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;

  // Filter toevoegen om het geluid te vormen
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass'; // Laagdoorlaatfilter
  filter.frequency.setValueAtTime(200, audioContext.currentTime); // Filter frequentie instellen

  // Envelope voor volume
  const envelope = audioContext.createGain();
  envelope.gain.setValueAtTime(1, audioContext.currentTime);
  envelope.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.5,
  ); // Lange decay

  // Verbind de nodes
  oscillator.connect(filter);
  noise.connect(filter);
  filter.connect(envelope);
  envelope.connect(audioContext.destination);

  // Start de oscillatoren
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5); // Stop de oscillator na 0.5 seconden
  noise.start();
  noise.stop(audioContext.currentTime + 0.5);
};

export { playExample };
