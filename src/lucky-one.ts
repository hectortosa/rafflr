
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import confetti from 'canvas-confetti';
import { shuffle } from 'shufflr';

import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';

import { SaveController } from './save-controller';

import "./dynamic-list";
import "./result-panel";

/**
 * Choose one from a list
 *
 * @fires setup-saved - Indicates when the list changes
 */
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
      }
      div.winners-panel {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }
      span {
        margin-block-start: 4em;
      }`
  ];

  @state()
  protected _participants = new Array<string>();

  @state()
  protected _theLuckyOne: string = "";

  @state()
  protected _raffleEnded: boolean = false;

  private saveController: SaveController = new SaveController(this, "lucky-one");

  constructor() {
    super();

    let params = new URLSearchParams(window.location.search);
    let initialParticipants = params.get("participants")?.split(";");

    if (initialParticipants) {
      this._participants = initialParticipants;
    }
  }

  override render() {
    return html`
      <div @list-changed=${this._onItemsChanged}>
        <header>
          <h1>Lucky one</h1>
        </header>
        <dynamic-list name="Participants" .list=${this._participants}></dynamic-list>
        <footer>
          <button id="lucky-one-run" ?disabled=${!this._canRaffle()} @click=${this._runWithDelay}>Pick one</button>
          <a @click=${this._save} part="button">Copy setup</a>
        </footer>
        <div class="winners-panel">
          <span ?hidden=${!this._raffleEnded}>🍀</span>
          <result-panel ?hidden=${this._theLuckyOne == ""} title=${this._theLuckyOne} .result=${[]}></result-panel>
          <span ?hidden=${!this._raffleEnded}>🍀</span>
        </div>
      </div>
    `;
  }

  private async _save() {
    let setupToSave = { participants: this._participants };
    await this.saveController.save(setupToSave);
  }

  private _canRaffle(): boolean {
    return this._participants.length > 1;
  }

  private async _runWithDelay() {
    this._raffleEnded = false;

    for (let i = 0; i < 15; i++) {
      await this.sleep(i < 10 ? 100 : 50 * i); 
      this._getLuckyOne();
    }

    await this.sleep(300);

    confetti({ particleCount: 100, origin: { x: 0.5, y: 0.8 } });
    this._raffleEnded = true;
  }

  private sleep(millis: number) { 
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  private _getLuckyOne() {
    let participantsToShuffle: Array<string> = this._participants;

    if (this._participants.length == 2) {
      participantsToShuffle = new Array<string>();

      for (let i = 0; i < 5; i++) {
        participantsToShuffle.push(this._participants[0]);
        participantsToShuffle.push(this._participants[1]);
      }
    }

    const shuffledParticipants = shuffle(participantsToShuffle);
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
