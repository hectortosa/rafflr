import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
    provideFluentDesignSystem,
    fluentButton,
    fluentMenu,
    fluentMenuItem
} from "@fluentui/web-components";
import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';

import './prize-raffle';
import './lucky-one';
import './shuffle-order';
import './random-teams';

import githubSvgUrl from './assets/github-mark-white.svg';

provideFluentDesignSystem()
    .register(
        fluentButton(),
        fluentMenu(),
        fluentMenuItem()
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
            background-color: #24d1db;
            color: white;
            height: 56px;
            width: 90vw;
            align-items: center;
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
            padding: 16px;
        }
        .header-left {
            order: 1;
            display: flex;
            align-items: center;
            padding: 0 16px;
        }
        .header-left-menu {
            order: 1;
            flex: 1;
            margin: 5px;
        }
        .header-left-title {
            order: 3;
            flex: 3;
            margin: 0 20px;
        }
        .header-main {
            order: 2;
        }
        .header-right {
            order: 3;
            display: flex;
            flex-grow: 1;
            justify-content: flex-end;
            align-items: center;
        }
        .end {
            align-self: flex-end;
            text-decoration: none;
            font-size: 2em;
            width: 50px;
        }
        .selected {
            font-weight: bold;
            font-style: italic;
        }
        .github-icon {
            width: 35px;
            height: 35px;
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
        fluent-button {
            background-color: white;
            color: #24d1db;
            justify-content: space-around;
        }
        fluent-menu {
            opacity: 0;
            background-color: #24d1db;
            position: absolute;
            transition: opacity 0.3s ease-in-out;
        }
        fluent-menu.show {
            opacity: 1;
        }
        fluent-menu-item {
            background-color: #24d1db;
            color: white;
        }
        fluent-menu-item:hover {
            background-color: #00f2ff;
        }`
    ];

    @state()
    private _selectedMenu: string = "prize-raffle";

    @state()
    protected _showMenu: boolean = false;

    @state()
    protected _saveMessage: string = "";

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
            case 'random-teams':
                appSelected = html`<random-teams></random-teams>`;
                break;
            default:
                appSelected = html`<prize-raffle></prize-raffle>`;
                break;
        }

        return html`
            <header>
                <div class="header-left">
                    <fluent-button class="header-left-menu" @click=${this._toggleMenu}>Menu</fluent-button>
                    <h1 class="header-left-title">Rafflr</h1>
                </div>
                <div class="header-right">
                    <a class="end" target="_blank" href="https://github.com/hectortosa/rafflr" alt="Rafflr on GitHub">
                        <img class="github-icon" src=${githubSvgUrl} alt="Rafflr on GitHub" />
                    </a>
                    <a class="end" target="_blank" href="https://github.com/hectortosa/rafflr/issues/new?assignees=hectortosa&labels=feature+request&projects=&template=request-new-feature.md&title=I+would+like+the+app+to+do..." alt="Request new feature">💡</a>
                </div>
            </header>
            <fluent-menu>
                <fluent-menu-item id="price-raffle" @click=${this._menuItemSelected}>Price Raffle</fluent-menu-item>
                <fluent-menu-item id="lucky-one" @click=${this._menuItemSelected}>Lucky One</fluent-menu-item>
                <fluent-menu-item id="shuffle-order" @click=${this._menuItemSelected}>Shuffle Order</fluent-menu-item>
                <fluent-menu-item id="random-teams" @click=${this._menuItemSelected}>Random Teams</fluent-menu-item>
            </fluent-menu>
            <div @setup-saved=${this._onSaved} class="content">
                ${appSelected}
            </div>
            <footer>
                <p id="save-confirmation-message" hidden>${this._saveMessage}</p>
            </footer>
        `;
    }

    private _toggleMenu() {
        const menu = this.shadowRoot?.querySelector('fluent-menu');
        menu?.classList.toggle('show');
    }

    private _menuItemSelected(e: CustomEvent) {
        const menuItem = (e.target as HTMLLinkElement);
        this._selectedMenu = menuItem.id;
        const menu = this.shadowRoot?.querySelector('fluent-menu');
        menu?.classList.toggle('show');
    }

    private _onSaved(e: CustomEvent) {
        this._saveMessage = e.detail.message;
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
