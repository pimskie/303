import { LitElement, css, html } from 'lit';

import { envelope } from '@/config/envelope';

export class EnvelopeEditor extends LitElement {
  static styles = css`
    .editor {
      display: grid;
      grid-template-columns: repeat(4, 5rem);
    }

    .input {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--size-2);
    }

    input[type='range'] {
      width: 100%;
      margin: 2rem 0;
      transform: rotate(270deg);
    }
  `;

  render() {
    const config = [
      { id: 'attack', label: 'A' },
      { id: 'decay', label: 'D' },
      { id: 'sustain', label: 'S' },
      { id: 'release', label: 'R' },
    ];

    return html`
      <div class="editor">
        ${config.map(
          (p) => html`
            <div class="input">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value="${envelope[p.id]}"
                id="${p.id}"
                @input="${this.onInput}"
              />
              <label for="${p.id}">${p.label}</label>
              <div class="value">${envelope[p.id]}</div>
            </div>
          `,
        )}
      </div>
    `;
  }

  onInput({ target }) {
    const { id, valueAsNumber } = target;

    envelope[id] = valueAsNumber;

    this.requestUpdate();
  }
}

customElements.define('p-envelope-editor', EnvelopeEditor);
