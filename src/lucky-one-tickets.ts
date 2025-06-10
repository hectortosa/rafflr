import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import confetti from 'canvas-confetti';
import { shuffle } from 'shufflr';

import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';

import { SaveController } from './save-controller';

import "./dynamic-list-with-tickets";
import "./result-panel";

/**
 * Choose one from a list where participants can have multiple tickets
 *
 * @fires setup-saved - Indicates when the list changes
 */
@customElement('lucky-one-tickets')
export class LuckyOneTickets extends LitElement {
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
  protected _participants = new Array<ParticipantWithTickets>();

  @state()
  protected _lastPick: string = "";

  @state()
  protected _picked = new Array<string>();

  @state()
  protected _removePick: boolean = false;

  @state()
  protected _raffleEnded: boolean = false;

  @state()
  protected _useTickets: boolean = true;

  private saveController: SaveController = new SaveController(this, "lucky-one-tickets");

  constructor() {
    super();

    let params = new URLSearchParams(window.location.search);
    let initialParticipants = params.get("participants")?.split(";");
    let removePick = params.get("removePick") == "true" ? true : false;
    let picked = params.get("picked")?.split(";");
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

    if (removePick) {
      this._removePick = removePick;
    }

    if (picked) {
      this._picked = picked;
      this._lastPick = this._picked[0];
    }

    this._useTickets = useTickets;
  }

  override render() {
    return html`
      <div @list-changed=${this._onItemsChanged}>
        <header>
          <h1>Lucky One (with Tickets)</h1>
        </header>
        <div class="mode-selector">
          <label>
            <input type="checkbox" .checked=${this._useTickets} @change=${this._onUseTicketsChanged}>
            Use ticket counts (more tickets = higher chance)
          </label>
        </div>
        <dynamic-list-with-tickets name="Participants" .list=${this._participants}></dynamic-list-with-tickets>
        <footer>
          <button id="lucky-one-run" ?disabled=${!this._canRaffle()} @click=${this._runWithDelay}>Pick one</button>
          <div>
            <input type="checkbox" id="remove-pick" name="remove-pick" .checked=${this._removePick} @change=${this._onRemovePickChanged}>
            <label for="remove-pick">Remove pick</label>
          </div>
          <a @click=${this._save} part="button">Copy setup</a>
        </footer>
        <div class="winners-panel">
          <span ?hidden=${!this._raffleEnded}>🍀</span>
          <result-panel ?hidden=${this._picked.length == 0} title=${this._lastPick} .result=${this._picked.slice(1)}></result-panel>
          <span ?hidden=${!this._raffleEnded}>🍀</span>
        </div>
      </div>
    `;
  }

  private async _save() {
    let setupToSave = {
      participants: this._participants.map(p => `${p.name}:${p.tickets}`),
      picked: this._removePick ? this._picked : [],
      removePick: this._removePick,
      useTickets: this._useTickets
    };

    await this.saveController.save(setupToSave);
  }

  private _canRaffle(): boolean {
    return this._participants.length > 1;
  }

  private async _runWithDelay() {
    this._raffleEnded = false;

    if (this._removePick) {
      this._picked.unshift("FILLER");
    }

    for (let i = 0; i < 15; i++) {
      await this.sleep(i < 10 ? 100 : 50 * i); 
      this._getLuckyOne();
    }

    if (this._removePick) {
      this._picked = this._picked.filter(picked => picked !== "FILLER");
      this._participants = this._participants.filter(participant => participant.name !== this._lastPick);
      this._picked.unshift(this._lastPick);
    }
    else {
      this._picked = [this._lastPick];
    }

    await this.sleep(300);

    confetti({ particleCount: 100, origin: { x: 0.5, y: 0.8 } });
    this._raffleEnded = true;
  }

  private sleep(millis: number) { 
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  private _getLuckyOne() {
    let ticketPool: Array<string> = [];

    if (this._useTickets) {
      // Create a pool where each participant appears as many times as their ticket count
      for (const participant of this._participants) {
        for (let i = 0; i < participant.tickets; i++) {
          ticketPool.push(participant.name);
        }
      }
    } else {
      // Equal chance for everyone regardless of ticket count
      ticketPool = this._participants.map(p => p.name);
    }

    // Handle case with only 2 participants
    if (this._participants.length === 2 && ticketPool.length < 10) {
      const originalPool = [...ticketPool];
      for (let i = 0; i < 5; i++) {
        ticketPool = ticketPool.concat(originalPool);
      }
    }

    const shuffledTickets = shuffle(ticketPool);
    const luckyOne = shuffledTickets[0];

    this._lastPick = luckyOne;
  }

  private _onItemsChanged(e: CustomEvent) {
    if (e.detail.name === "Participants") {
      this._participants = e.detail.list;
    }
  }

  private _onRemovePickChanged(e: Event) {
    this._removePick = (e.target as HTMLInputElement).checked;
    console.log('Remove pick changed to: ' + this._removePick)
  }

  private _onUseTicketsChanged(e: Event) {
    this._useTickets = (e.target as HTMLInputElement).checked;
    console.log('Use tickets changed to: ' + this._useTickets)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucky-one-tickets': LuckyOneTickets;
  }
}