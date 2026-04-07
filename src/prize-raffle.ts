import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import confetti from 'canvas-confetti';

import { buildTicketPoolFromParticipants, performRaffle } from './prize-raffle.logic';
import { parseParticipantsWithTickets } from './lucky-one.logic';

import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';

import { SaveController } from './save-controller';

import "./dynamic-list";
import "./dynamic-list-with-tickets";
import "./result-panel";

/**
 * Raffle prices among participants
 *
 * @fires setup-saved - Indicates when setup is saved
 */
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
  protected _prizes:  Array<string> = [];

  @state()
  protected _participants:  Array<string> = [];

  @state()
  protected _participantsWithTickets: Array<ParticipantWithTickets> = [];

  @state()
  protected _results: Array<RaffleResult> = [];

  @state()
  protected _raffleEnded: boolean = false;

  @state()
  protected _useTickets: boolean = false;

  private saveController: SaveController = new SaveController(this, "prize-raffle");

  constructor() {
    super();

    let params = new URLSearchParams(window.location.search);
    let initialParticipants = params.get("participants")?.split(";");
    let initialPrizes = params.get("prizes")?.split(";");
    let useTickets = params.get("useTickets") == "true" ? true : false;

    if (initialParticipants) {
      if (useTickets) {
        this._participantsWithTickets = parseParticipantsWithTickets(initialParticipants);
      } else {
        this._participants = initialParticipants;
      }
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
          <h1>Prize Raffle</h1>
        </header>
        <div class="mode-selector">
          <label>
            <input type="checkbox" .checked=${this._useTickets} @change=${this._onUseTicketsChanged}>
            Enable tickets (participants can have multiple entries)
          </label>
        </div>
        <dynamic-list name="Prizes" .list=${this._prizes}></dynamic-list>
        ${this._useTickets 
          ? html`<dynamic-list-with-tickets name="Participants" .list=${this._participantsWithTickets}></dynamic-list-with-tickets>`
          : html`<dynamic-list name="Participants" .list=${this._participants}></dynamic-list>`
        }
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
    let setupToSave: any = { 
      prizes: this._prizes,
      useTickets: this._useTickets 
    };

    if (this._useTickets) {
      setupToSave.participants = this._participantsWithTickets.map(p => `${p.name}:${p.tickets}`);
    } else {
      setupToSave.participants = this._participants;
    }

    this.saveController.save(setupToSave);
  }

  private _canRaffle(): boolean {
    if (this._prizes.length === 0) return false;
    
    if (this._useTickets) {
      return this._participantsWithTickets.length > 1;
    }
    return this._participants.length > 1;
  }

  private _onItemsChanged(e: CustomEvent) {
    if (e.detail.name === "Prizes") {
      this._prizes = e.detail.list;
    } else if (e.detail.name === "Participants") {
      if (this._useTickets) {
        this._participantsWithTickets = e.detail.list;
      } else {
        this._participants = e.detail.list;
      }
    }
  }

  private _onUseTicketsChanged(e: Event) {
    this._useTickets = (e.target as HTMLInputElement).checked;
    
    // Convert between formats when toggling
    if (this._useTickets) {
      // Convert simple participants to participants with tickets
      this._participantsWithTickets = this._participants.map(name => ({ name, tickets: 1 }));
      this._participants = [];
    } else {
      // Convert participants with tickets to simple participants
      this._participants = this._participantsWithTickets.map(p => p.name);
      this._participantsWithTickets = [];
    }
    
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
    const ticketPool = this._useTickets
      ? buildTicketPoolFromParticipants(this._participantsWithTickets)
      : [...this._participants];

    this._results = performRaffle(ticketPool, this._prizes);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prize-raffle': PrizeRaffle;
  }
}
