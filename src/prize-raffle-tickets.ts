import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import confetti from 'canvas-confetti';
import { shuffle } from 'shufflr';

import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';

import { SaveController } from './save-controller';

import "./dynamic-list";
import "./dynamic-list-with-tickets";
import "./result-panel";

/**
 * Raffle prices among participants with ticket support
 *
 * @fires setup-saved - Indicates when setup is saved
 */
@customElement('prize-raffle-tickets')
export class PrizeRaffleTickets extends LitElement {
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
      }
      .mode-selector {
        margin: 1em 0;
        display: flex;
        justify-content: center;
        gap: 20px;
      }
      .mode-selector label {
        cursor: pointer;
      }`
  ];

  @state()
  protected _prizes: Array<string> = [];

  @state()
  protected _participants: Array<ParticipantWithTickets> = [];

  @state()
  protected _results: Array<RaffleResult> = [];

  @state()
  protected _raffleEnded: boolean = false;

  @state()
  protected _useTickets: boolean = true;

  private saveController: SaveController = new SaveController(this, "prize-raffle-tickets");

  constructor() {
    super();

    let params = new URLSearchParams(window.location.search);
    let initialParticipants = params.get("participants")?.split(";");
    let initialPrizes = params.get("prizes")?.split(";");
    let useTickets = params.get("useTickets") !== "false"; // Default to true

    if (initialParticipants) {
      // Parse participants with tickets format (name:tickets)
      this._participants = initialParticipants.map(p => {
        const parts = p.split(':');
        if (parts.length === 2) {
          return { name: parts[0], tickets: parseInt(parts[1]) || 1 };
        }
        return { name: p, tickets: 1 };
      });
    }

    if (initialPrizes) {
      this._prizes = initialPrizes;
    }

    this._useTickets = useTickets;
  }

  override render() {
    return html`
      <div @list-changed=${this._onItemsChanged}>
        <header>
          <h1>Prize Raffle (with Tickets)</h1>
        </header>
        <div class="mode-selector">
          <label>
            <input type="checkbox" .checked=${this._useTickets} @change=${this._onUseTicketsChanged}>
            Use ticket counts (more tickets = higher chance)
          </label>
        </div>
        <dynamic-list name="Prizes" .list=${this._prizes}></dynamic-list>
        <dynamic-list-with-tickets name="Participants" .list=${this._participants}></dynamic-list-with-tickets>
        <footer>
          <button id="prize-raffle-run" ?disabled=${!this._canRaffle()} @click=${this._runWithDelay}>Raffle</button>
          <a @click=${this._save} part="button">Copy setup</a>
        </footer>
        <div class="winners-panel">
          <span ?hidden=${!this._raffleEnded}>🏆</span>
          ${this._results.map(
            (resultItem) =>
            html`
                <result-panel title=${resultItem.winner} .result=${resultItem.prizes}></result-panel> 
            `
          )}
          <span ?hidden=${!this._raffleEnded}>🏆</span>
        </div>
      </div>
    `;
  }

  private _save() {
    let setupToSave = { 
      participants: this._participants.map(p => `${p.name}:${p.tickets}`), 
      prizes: this._prizes,
      useTickets: this._useTickets 
    };
    this.saveController.save(setupToSave);
  }

  private _canRaffle(): boolean {
    return this._prizes.length > 0 && this._participants.length > 1;
  }

  private _onItemsChanged(e: CustomEvent) {
    if (e.detail.name === "Prizes") {
      this._prizes = e.detail.list;
    } else if (e.detail.name === "Participants") {
      this._participants = e.detail.list;
    }
  }

  private _onUseTicketsChanged(e: Event) {
    this._useTickets = (e.target as HTMLInputElement).checked;
    console.log('Use tickets changed to: ' + this._useTickets)
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

    // Create ticket pool based on mode
    let ticketPool: Array<string> = [];
    
    if (this._useTickets) {
      // Create a pool where each participant appears as many times as their ticket count
      for (const participant of this._participants) {
        for (let i = 0; i < participant.tickets; i++) {
          ticketPool.push(participant.name);
        }
      }
    } else {
      // Equal chance for everyone
      ticketPool = this._participants.map(p => p.name);
    }

    // Build expanded participants list if needed
    let unrollParticipants = this._buildParticipantsList(ticketPool, this._prizes.length, "For sharing");
    const shuffledParticipants = shuffle(unrollParticipants);
    const shuffledPrizes = shuffle(this._prizes);

    for (var i = 0; i < this._prizes.length; i++) {
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

  private _buildParticipantsList(ticketPool: Array<string>, numberOfPrizes: number, spareParticipant: string) {
    let assignement;
    let toShare;
    let newParticipantsList = new Array<string>();
      
    if (numberOfPrizes <= ticketPool.length) {
      return ticketPool;
    }
  
    assignement = Math.floor(numberOfPrizes / ticketPool.length);
    toShare = numberOfPrizes - (assignement * ticketPool.length);
    
    for (var i = 0; i < assignement; i++) {
      newParticipantsList = newParticipantsList.concat(ticketPool);
    }
    
    for (var j = 0; j < toShare; j++) {
      newParticipantsList.push(spareParticipant);
    }
    
    return newParticipantsList;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prize-raffle-tickets': PrizeRaffleTickets;
  }
}