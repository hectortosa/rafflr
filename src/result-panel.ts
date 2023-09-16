import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('result-panel')
export class ResultPanel extends LitElement {
    static styles = css`
      h4 {
        font-size: x-large;
        text-transform: capitalize;
      }
      div.result-panel {
        margin: 1em;
        padding: 1em;
        text-align: center;
        vertical-align: top;
        display: inline-block;
      }
      div.prize {
        margin: 10px;
        text-align: center;
        display: block;
      }
    `;

    @property({ type: String })
    title = "";

    @property({ type: Array })
    result: Array<string> = [];

    override render() {
        return html`
        <div class="result-panel">
        <h4>${this.title}</h4>
        ${this.result.map(
            (resultItem) =>
            html`
                <div class="prize">${resultItem}</div>
            `
        )}
        </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'result-panel': ResultPanel;
    }
}
