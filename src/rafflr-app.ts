import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { linkStyles } from './styles/link-styles';

import './prize-raffle';
import './lucky-one';
import './shuffle-order';

@customElement('rafflr-app')
export class RafflrApp extends LitElement {
    static styles = [
        linkStyles,
        css`
        :host {
            margin-inline: auto;
            display: block;
            text-align: center;
            padding-block: 16px;
            max-width: 1080px ;
        }
        header {
            display: flex;
            justify-content: left;
            background: #24d1db;
            color: white;
            height: 56px;
            align-items: center;
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
            padding: 16px;
        }
        .header-left {
            order: 1;
        }
        .header-main {
            order: 2;
        }
        .header-right {
            order: 3;
            display: flex;
            flex-grow: 1;
            justify-content: flex-end;
        }
        a {
            color: white;
            cursor: pointer;
            margin-inline: 8px;
            vertical-align: text-bottom;
            width: 120px;
            font-size: 1.1em;
        }
        a:hover {
            color: white;
            font-weight: bold;
        }
        .end {
            align-self: flex-end;
            text-decoration: none;
        }
        .selected {
            font-weight: bold;
            font-style: italic;
        }
        ul {
            display: flex;
            justify-content: space-around;
        }`
    ];

    @state()
    private selectedMenu: string = 'prize-raffle';

    constructor() {
        super();
        let params = new URLSearchParams(window.location.search);
        this.selectedMenu = params.get('menu') || 'prize-raffle';
    }

    override render() {
        let appSelected;

        switch (this.selectedMenu) {
            case 'prize-raffle':
                appSelected = html`<prize-raffle></prize-raffle>`;
                break;
            case 'lucky-one':
                appSelected = html`<lucky-one></lucky-one>`;
                break;
            case 'shuffle-order':
                appSelected = html`<shuffle-order></shuffle-order>`;
                break;
            default:
                appSelected = html`<prize-raffle></prize-raffle>`;
                break;
        }

        const raffleClasses = {
            selected: this.selectedMenu == 'prize-raffle'
        };
        const luckyOneClasses = {
            selected: this.selectedMenu == 'lucky-one'
        };
        const shuffleOrderClasses = {
            selected: this.selectedMenu == 'shuffle-order'
        };

        return html`
            <header>
                <div class="header-left">
                    <h1>Rafflr</h1>
                </div>
                <div class="header-main">
                    <ul>
                        <a id="prize-raffle" class=${classMap(raffleClasses)} @click=${this._menuItemSelected}>Prize Raffle</a>
                        <a id="lucky-one" class=${classMap(luckyOneClasses)} @click=${this._menuItemSelected}>Lucky One</a>
                        <a id="shuffle-order" class=${classMap(shuffleOrderClasses)} @click=${this._menuItemSelected}>Shuffle Order</a>
                    </ul>
                </div>
                <div class="header-right">
                    <a class="end" target="_blank" href="https://github.com/hectortosa/rafflr" alt="Rafflr on GitHub">View on GitHub</a>
                </div>
            </header>
                ${appSelected}
            <footer></footer>
        `;
    }

    private _menuItemSelected(e: CustomEvent) {
        const menuItem = (e.target as HTMLLinkElement);
        this.selectedMenu = menuItem.id;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'rafflr-app': RafflrApp;
    }
  }