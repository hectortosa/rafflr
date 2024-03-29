import {
    fluentButton,
    fluentMenu,
    fluentMenuItem,
    provideFluentDesignSystem
} from "@fluentui/web-components";
import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { shuffle } from 'shufflr';
import githubSvgUrl from './assets/github-mark-white.svg';
import rafflrNoBgUrl from './assets/rafflr-no-bg.png';
import './dice-roll';
import './lucky-one';
import './prize-raffle';
import './random-teams';
import './shuffle-order';
import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';

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
            width: 100%;
            align-items: center;
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
            padding: 16px;
        }
        .header-left {
            order: 1;
            display: flex;
            align-items: center;
        }
        .header-left-menu {
            order: 1;
            flex: 1;
            margin-left: 10px;
        }
        .header-left-logo {
            order: 2;
            margin-left: 20px;
            height: 40px;
        }
        .header-left-title {
            order: 3;
            flex: 1;
            margin-left: 20px;
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
            display: none;
            background-color: #24d1db;
            position: absolute;
            transition: opacity 0.3s ease-in-out;
        }
        fluent-menu.show {
            display: block;
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

    protected _menuItems: Array<string> = [
        'dice-roll',
        'lucky-one',
        'prize-raffle',
        'random-teams',
        'shuffle-order'
    ];

    constructor() {
        super();
        // Get the last part of the pathname as the selected menu
        this._selectedMenu = window.location.pathname.split('/').pop() || shuffle(this._menuItems)[0];
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
            case 'dice-roll':
                appSelected = html`<dice-roll></dice-roll>`;
                break;
            default:
                appSelected = html`<prize-raffle></prize-raffle>`;
                break;
        }

        return html`
            <header>
                <div class="header-left">
                    <fluent-button class="header-left-menu" @click=${this._toggleMenu}>Menu</fluent-button>
                    <img class="header-left-logo" src=${rafflrNoBgUrl} alt="Rafflr Logo">
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
                <fluent-menu-item id="dice-roll" @click=${this._menuItemSelected}>Dice Roll</fluent-menu-item>
                <fluent-menu-item id="lucky-one" @click=${this._menuItemSelected}>Lucky One</fluent-menu-item>
                <fluent-menu-item id="price-raffle" @click=${this._menuItemSelected}>Price Raffle</fluent-menu-item>
                <fluent-menu-item id="random-teams" @click=${this._menuItemSelected}>Random Teams</fluent-menu-item>
                <fluent-menu-item id="shuffle-order" @click=${this._menuItemSelected}>Shuffle Order</fluent-menu-item>
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

        this._toggleMenu();

        // Update the URL
        const url = new URL(window.location.href);
        url.pathname = '/' + this._selectedMenu;
        window.history.pushState({}, '', url.toString());
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
