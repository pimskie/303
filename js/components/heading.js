import { LitElement } from 'lit';
import { literal, html } from 'lit/static-html.js';

export class Heading extends LitElement {
  static properties = {
    //tag: { type: String },
  };

  tag = literal`h1`;

  constructor() {
    super();
  }

  render() {
    return html`<${this.tag}><slot></slot></${this.tag}>`;
  }
}

customElements.define('p-heading', Heading);
