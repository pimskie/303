import { LitElement, html } from 'lit';

export class OscillatorType extends LitElement {
  static properties = {
    type: { type: String },
    toneId: { type: String },
  };

  constructor() {
    super();

    this.type = 'sine';
    this.toneId = null;
  }

  render() {
    return html`
      <select id="${this.toneId}" @change="${this.onTypeChange}">
        <option value="square" ?selected="${this.type === 'square'}">
          square
        </option>
        <option value="sine" ?selected="${this.type === 'sine'}">sine</option>
        <option value="sawtooth" ?selected="${this.type === 'sawtooth'}">
          sawtooth
        </option>
        <option value="triangle" ?selected="${this.type === 'triangle'}">
          triangle
        </option>
      </select>

      <select id="${this.toneId}" @change="${this.onOctaveChange}">
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    `;
  }

  onTypeChange(e) {
    this.dispatchEvent(
      new CustomEvent('onTypeChange', {
        detail: {
          id: this.toneId,
          value: e.target.value,
        },
      }),
    );
  }

  onOctaveChange(e) {
    this.dispatchEvent(
      new CustomEvent('onOctaveChange', {
        detail: {
          id: this.toneId,
          value: e.target.value,
        },
      }),
    );
  }
}

customElements.define('p-oscillator-type', OscillatorType);
