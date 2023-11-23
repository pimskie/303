import { LitElement, html, css } from 'lit';

export class Step extends LitElement {
  static properties = {
    isSelected: { type: Boolean, reflect: true },
    id: { type: String },
    tone: { type: String },
    index: { type: String },
  };

  render() {
    return html`<input
      type="checkbox"
      name="step"
      id="${this.id}"
      ?checked="${this.isSelected}"
      @change="${this.onChange}"
    />`;
  }

  onChange(e) {
    const options = {
      id: this.id,
      isSelected: e.target.checked,
    };

    this.isSelected = options.isSelected;

    // this.dispatchEvent(
    //   new CustomEvent('selectedChanged', {
    //     detail: options,
    //     bubbles: true,
    //   }),
    // );
  }
}

customElements.define('p-step', Step);
