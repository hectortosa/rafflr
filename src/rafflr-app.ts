import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
    fastButton,
    fastDialog,
    fastMenu,
    fastMenuItem, 
    provideFASTDesignSystem 
} from "@microsoft/fast-components";
import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';

import './prize-raffle';
import './lucky-one';
import './shuffle-order';

provideFASTDesignSystem()
    .register(
        fastButton(),
        fastDialog(),
        fastMenu(),
        fastMenuItem()
    );

@customElement('rafflr-app')
export class RafflrApp extends LitElement {
    static styles = [
        buttonStyles,
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
            display: flex;
            align-items: center;
        }
        .header-left-item {
            flex: 1;
            margin: 5px;
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
        .end {
            align-self: flex-end;
            text-decoration: none;
        }
        .selected {
            font-weight: bold;
            font-style: italic;
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
        fast-button {
            background-color: white;
            color: #24d1db;
            justify-content: space-around;
        }
        fast-menu {
            opacity: 0;
            background-color: #24d1db;
            position: absolute;
            transition: opacity 0.3s ease-in-out;
        }
        fast-menu.show {
            opacity: 1;
        }
        fast-menu-item {
            background-color: #24d1db;
            color: white;
        }
        fast-menu-item:hover {
            background-color: #00f2ff;
        }`
    ];

    @state()
    private _selectedMenu: string = 'prize-raffle';

    @state()
    protected _showMenu: boolean = false;

    constructor() {
        super();
        let params = new URLSearchParams(window.location.search);
        this._selectedMenu = params.get('menu') || 'prize-raffle';
    }

    override render() {
        let appSelected;

        switch (this._selectedMenu) {
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

        return html`
            <header>
                <div class="header-left">
                    <fast-button class="header-left-item" @click=${this._toggleMenu}>Menu</fast-button>
                    <h1 class="header-left-item">Rafflr</h1>
                </div>
                <div class="header-right">
                    <a class="end" target="_blank" href="https://github.com/hectortosa/rafflr" alt="Rafflr on GitHub">View on GitHub</a>
                </div>
            </header>
            <fast-menu>
                <fast-menu-item id="price-raffle" @click=${this._menuItemSelected}>Price Raffle</fast-menu-item>
                <fast-menu-item id="lucky-one" @click=${this._menuItemSelected}>Lucky One</fast-menu-item>
                <fast-menu-item id="shuffle-order" @click=${this._menuItemSelected}>Shuffle Order</fast-menu-item>
            </fast-menu>
            <div @setup-saved=${this._onSaved} class="content">
                ${appSelected}
            </div>
            <footer>
                <p id="save-confirmation-message" hidden>URL copied to clipboard</p>
            </footer>
        `;
    }

    private _toggleMenu() {
        const menu = this.shadowRoot?.querySelector('fast-menu');
        menu?.classList.toggle('show');
    }

    private _menuItemSelected(e: CustomEvent) {
        const menuItem = (e.target as HTMLLinkElement);
        this._selectedMenu = menuItem.id;
        const menu = this.shadowRoot?.querySelector('fast-menu');
        menu?.classList.toggle('show');
    }

    private _onSaved(e: CustomEvent) {
        const confirmationMessage = this.shadowRoot?.querySelector('#save-confirmation-message');
        confirmationMessage?.toggleAttribute('hidden');
        setTimeout(() => confirmationMessage?.toggleAttribute('hidden'), 1500);
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'rafflr-app': RafflrApp;
    }
  }