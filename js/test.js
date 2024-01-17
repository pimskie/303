document.querySelector('#play').addEventListener('click', () => {
  // Create an AudioContext
  const context = new AudioContext();

  // Create an oscillator
  const oscillator = context.createOscillator();

  // Create a low-pass filter
  const filter = new BiquadFilterNode(context, {
    type: 'lowpass',
    frequency: 800,
  });

  // Create an LFO (Low-Frequency Oscillator) for modulation
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(2, context.currentTime); // Adjust the modulation rate

  // Create an envelope for the sound
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0, context.currentTime);
  envelope.gain.linearRampToValueAtTime(1, context.currentTime + 0.5); // Attack
  envelope.gain.linearRampToValueAtTime(1, context.currentTime + 0.1); // Sustain
  envelope.gain.linearRampToValueAtTime(0, context.currentTime + 0.2); // Release

  // Connect the oscillator to the filter, then the filter to the envelope, and finally the envelope to the destination
  oscillator.connect(filter);
  filter.connect(envelope);
  envelope.connect(context.destination);

  // Connect the LFO to modulate the filter frequency
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfoGain.gain.setValueAtTime(200, context.currentTime); // Adjust the modulation depth

  // Set the oscillator type to square wave for a chiptune-like sound
  oscillator.type = 'sawtooth';

  // Set the frequency (adjust as needed)
  oscillator.frequency.setValueAtTime(100, context.currentTime);

  // Start the LFO and oscillator
  lfo.start();
  oscillator.start();

  // Stop the LFO and oscillator after a duration (adjust as needed)
  lfo.stop(context.currentTime + 2);
  oscillator.stop(context.currentTime + 0.2);
});
