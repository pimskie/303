import { LitElement, html, css } from 'lit';
import { tones, playTone } from '@/config/tones';

import '@/components/heading';
import '@/components/step';
import '@/components/oscillator-type';

export class Rack extends LitElement {
  static styles = css`
    .grid {
      display: grid;
      grid-template-columns: repeat(var(--columns), 1fr);
      gap: var(--size-3);
    }
  `;

  static properties = {
    steps: { type: Number },
    step: { type: Number },
  };

  constructor() {
    super();

    this.step = null;
    this.steps = 10;
    this.rows = tones.length;
    this.stepElements = [];
  }

  render() {
    const toneRows = tones.map((tone, index) => this.renderRow(tone, index));
    const indicatorRow = this.renderIndicatorRow();

    return html`
      <div class="rack">
        <p-heading>Rack</p-heading>
        <div class="grid" style="--columns: ${this.steps + 1};">
          ${toneRows} ${indicatorRow}
        </div>
      </div>
    `;
  }

  updated() {
    this.stepElements = [...this.shadowRoot.querySelectorAll('p-step')];
  }

  renderRow(tone, rowIndex) {
    const cells = [html`<div>${this.renderTypeDropdown(tone)}</div>`];

    for (let i = 0; i < this.steps; i++) {
      const id = `${tone.id}-${i}`;
      const isSelected = (i + rowIndex) % 3 === 0;

      cells.push(html`
        <div class="cell">
          <p-step
            id=${id}
            tone="${tone.id}"
            .index="${i}"
            ?isselected="${isSelected}"
          >
          </p-step>
        </div>
      `);
    }

    return cells;
  }

  renderIndicatorRow() {
    const cells = [html`-`];

    for (let i = 0; i < this.steps; i++) {
      cells.push(
        html`<div class="cell">
          <input
            type="radio"
            name="indicator"
            id="indicator-${i}-${this.step}"
            ?checked="${i === this.step}"
          />
        </div>`,
      );
    }

    return cells;
  }

  renderTypeDropdown(tone) {
    const dropdown = html`
      <p-oscillator-type
        toneId="${tone.id}"
        .type="${tone.type}"
        @onTypeChange="${this.onToneTypeChanged}"
        @onOctaveChange="${this.onOctaveChanged}"
      ></p-oscillator-type>
    `;
    return html`
      <div>${tone.label}</div>
      ${dropdown}
    `;
  }

  onToneTypeChanged(e) {
    const { id, value } = e.detail;
    const tone = tones.find((t) => t.id === id);

    tone.type = value;
  }

  onOctaveChanged(e) {
    const { id, value } = e.detail;
    const tone = tones.find((t) => t.id === id);

    tone.octave = value;
  }

  nextStep() {
    this.updateStep();
    this.runStep();
  }

  updateStep() {
    if (this.step === null) {
      this.step = 0;

      return;
    }

    if (this.step + 1 < this.steps) {
      this.step += 1;

      return;
    }

    this.step = 0;
  }

  runStep() {
    const checkedStepElements = this.stepElements.filter(
      (e) => e.index === this.step && e.isSelected,
    );

    const checkedTones = checkedStepElements.map((e) => e.tone);

    const tonesToPlay = tones.filter((t) => checkedTones.includes(t.id));

    tonesToPlay.forEach((tone) => playTone(tone));
  }

  reset() {
    this.step = null;
  }
}

customElements.define('p-rack', Rack);
