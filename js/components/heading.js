import { LitElement, html } from 'lit';

export class Heading extends LitElement {
  static properties = {
    tag: { type: String },
  };

  constructor() {
    super();

    this.tag = 'h1';
  }

  render() {
    return html`<h1><slot></slot></h1>`;
  }
}

customElements.define('p-heading', Heading);
