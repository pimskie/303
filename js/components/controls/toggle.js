import { LitElement, html } from 'lit';

export class Toggle extends LitElement {
  static properties = {
    isOn: { type: Boolean },
  };

  constructor() {
    super();

    this.isOn = false;
  }

  render() {
    const label = this.isOn ? 'Stop' : 'Start';

    return html` <button>${label}</button> `;
  }
}

customElements.define('p-toggle', Toggle);
