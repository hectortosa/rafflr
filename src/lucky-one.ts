
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import confetti from 'canvas-confetti';
import { shuffle } from 'shufflr';

import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';

import { SaveController } from './save-controller';

import "./dynamic-list";
import "./winner-panel";

@customElement('lucky-one')
export class LuckyOne extends LitElement {
  static override styles = [
    buttonStyles,
    linkStyles,
    css`
      :host {
        display: inline-block;
        text-align: center;
        padding-block: 16px;
        max-width: 800px;
      }
      footer {
        display: flex;
        flex-direction: column;
      }`
  ];

  @state()
  protected _participants = new Array<string>();

  @state()
  protected _theLuckyOne: string = "";

  private saveController: SaveController = new SaveController(this, "lucky-one");

  constructor() {
    super();

    let params = new URLSearchParams(window.location.search);
    let initialParticipants = params.get("participants")?.split(";");

    console.log("Initial participants: " + initialParticipants);

    if (initialParticipants) {
      this._participants = initialParticipants;
    }

    console.log("Participants: " + this._participants);
  }

  override render() {
    return html`
      <div @list-changed=${this._onItemsChanged}>
        <header>
          <h1>Lucky one</h1>
        </header>
        <dynamic-list name="Participants" .list=${this._participants}></dynamic-list>
        <footer>
          <button ?disabled=${!this._canRaffle()} @click=${this._runWithDelay}>Pick one</button>
          <a @click=${this._save} part="button">Save</a>
        </footer>
      </div>
      <div>
        <winner-panel ?hidden=${this._theLuckyOne == ""} winner=${this._theLuckyOne} .prizes=${[]}></winner-panel>
      </div>
    `;
  }

  private _save() {
    let setupToSave = { participants: this._participants };
    this.saveController.save(setupToSave);
  }

  private _canRaffle(): boolean {
    return this._participants.length > 0;
  }

  private async _runWithDelay() {
    if (this._participants.length == 1) {
      this._theLuckyOne = this._participants[0];
    } else {
      for (let i = 0; i < 15; i++) {
        await this.sleep(i < 10 ? 100 : 50 * i); 
        this._getLuckyOne();
      }
    }

    this._theLuckyOne = "🍀 " + this._theLuckyOne + " 🍀";

    await this.sleep(300);

    confetti({ particleCount: 100, origin: { x: 0.5, y: 0.8 } });
  }

  private sleep(millis: number) { 
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  private _getLuckyOne() {
    console.log(this._participants);
    const shuffledParticipants = shuffle(this._participants);
    const luckyOne = shuffledParticipants[0];

    this._theLuckyOne = luckyOne;
  }

  private _onItemsChanged(e: CustomEvent) {
    if (e.detail.name === "Participants") {
      this._participants = e.detail.list;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucky-one': LuckyOne;
  }
}
