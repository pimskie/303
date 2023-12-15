import { LitElement, html, css } from 'lit';

export class Step extends LitElement {
  static styles = css`
    :host([checked]) {
      /* background: red; */
    }

    :host([tone='e']) {
      background: hotpink;
    }
  `;

  static properties = {
    checked: { type: Boolean, reflect: true },
    id: { type: String },
    tone: { type: String },
    index: { type: String },
  };

  render() {
    return html` <input
      type="checkbox"
      name="step"
      id="${this.id}"
      ?checked="${this.checked}"
      @change="${this.onChange}"
    />`;
  }

  onChange(e) {
    const options = {
      id: this.id,
      checked: e.target.checked,
    };

    this.checked = options.checked;

    // this.dispatchEvent(
    //   new CustomEvent('selectedChanged', {
    //     detail: options,
    //     bubbles: true,
    //   }),
    // );
  }
}

customElements.define('p-step', Step);
