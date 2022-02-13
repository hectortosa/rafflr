
import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';

import confetti from 'canvas-confetti';
import { shuffle } from 'shufflr';

import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';

import { SaveController } from './save-controller';

import "./dynamic-list";

@customElement('prize-raffle')
export class PrizeRaffle extends LitElement {
  static override styles = [
    buttonStyles,
    linkStyles,
    css`
      :host {
        display: inline-block;
        text-align: center;
        padding-block: 16px;
      }
      div.winners-panel {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }
      footer {
        display: flex;
        flex-direction: column;
      }
      span {
        margin-block-start: 4em;
      }`
  ];

  @property({ type: Array })
  prizes:  Array<string> = [];

  @property({ type: Array })
  participants:  Array<string> = [];

  @state()
  protected _results: Array<RaffleResult> = [];

  @state()
  protected _raffleEnded: boolean = false;

  private saveController: SaveController = new SaveController(this, "prize-raffle");

  constructor() {
    super();

    let params = new URLSearchParams(window.location.search);
    let initialParticipants = params.get("participants")?.split(";");
    let initialPrizes = params.get("prizes")?.split(";");

    if (initialParticipants) {
      this.participants = initialParticipants;
    }

    if (initialPrizes) {
      this.prizes = initialPrizes;
    }

    console.log("Participants: " + this.participants);
    console.log("Prizes: " + this.prizes);
  }

  override render() {
    return html`
      <div @list-changed=${this._onItemsChanged}>
        <header>
          <h1>Prize Raffle</h1>
        </header>
        <dynamic-list name="Prizes" .list=${this.prizes}></dynamic-list>
        <dynamic-list name="Participants" .list=${this.participants}></dynamic-list>
        <footer>
          <button ?disabled=${!this._canRaffle()} @click=${this._runWithDelay}>Raffle</button>
          <a @click=${this._save} part="button">Save</a>
        </footer>
        <div class="winners-panel">
          <span ?hidden=${!this._raffleEnded}>🏆</span>
          ${this._results.map(
            (resultItem) =>
            html`
                <winner-panel winner=${resultItem.winner} .prizes=${resultItem.prizes}></winner-panel> 
            `
          )}
          <span ?hidden=${!this._raffleEnded}>🏆</span>
        </div>
      </div>
    `;
  }

  private _save() {
    let setupToSave = { participants: this.participants, prizes: this.prizes };
    this.saveController.save(setupToSave);
  }

  private _canRaffle(): boolean {
    return this.prizes.length > 0 && this.participants.length > 1;
  }

  private _onItemsChanged(e: CustomEvent) {
    if (e.detail.name === "Prizes") {
      this.prizes = e.detail.list;
    } else if (e.detail.name === "Participants") {
      this.participants = e.detail.list;
    }
  }

  private sleep(millis: number) { 
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  private async _runWithDelay() {
    this._raffleEnded = false;

    if (this._canRaffle()) {
      for (let i = 0; i < 15; i++) {
        await this.sleep(i < 10 ? 100 : 50 * i); 
        this._performRaffle();
      }
    }

    await this.sleep(300);

    confetti({ particleCount: 100, origin: { x: 0.5, y: 0.8 } });
    this._raffleEnded = true;
  }

  private async _performRaffle() {
    let results: Array<RaffleResult> = new Array<RaffleResult>();

    let unrollParticipants = this._buildParticipantsList(this.participants, this.prizes.length, "For sharing");
    const shuffledParticipants = shuffle(unrollParticipants);
    const shuffledPrizes = shuffle(this.prizes);

    for (var i = 0; i < this.prizes.length; i++) {
      var currentWinner = results.find(element => element.winner === shuffledParticipants[i]);

      if (currentWinner) {
        currentWinner.prizes.push(shuffledPrizes[i])
      } else {
        results.push({ winner: shuffledParticipants[i], prizes: [shuffledPrizes[i]] });
      }
    }

    results.sort((a, b) => {
      if (a.winner === b.winner) {
        return 0;
      }

      return a.winner < b.winner ? -1 : 1; 
    });

    this._results = results;
  }

  private _buildParticipantsList(participants: Array<string>, numberOfPrizes: number, spareParticipant: string) {
    let assignement;
    let toShare;
    let newParticipantsList = new Array<string>();
      
    if (numberOfPrizes <= participants.length) {
      return participants;
    }
  
    assignement = Math.floor(numberOfPrizes / participants.length);
    toShare = numberOfPrizes - (assignement * participants.length);
    
    for (var i = 0; i < assignement; i++) {
      newParticipantsList = newParticipantsList.concat(participants);
    }
    
    for (var j = 0; j < toShare; j++) {
      newParticipantsList.push(spareParticipant);
    }
    
    return newParticipantsList;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prize-raffle': PrizeRaffle;
  }
}
