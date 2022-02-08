import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('winner-panel')
export class WinnerPanel extends LitElement {
    static styles = css`
      h4 {
        font-size: x-large;
        text-transform: capitalize;
      }
      div.winner-panel {
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
    winner = "";

    @property({ type: Array })
    prizes: Array<string> = [];

    override render() {
        return html`
        <div class="winner-panel">
        <h4>${this.winner}</h4>
        ${this.prizes.map(
            (prizeItem) =>
            html`
                <div class="prize">${prizeItem}</div>
            `
        )}
        </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'winner-panel': WinnerPanel;
    }
}
