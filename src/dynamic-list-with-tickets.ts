import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { buttonStyles } from './styles/button-styles.js';
import { linkStyles } from './styles/link-styles.js';
import { inputStyles } from './styles/input-styles.js';

/**
 * List with input to add participants with ticket counts
 *
 * @fires list-changed - Indicates when the list changes
 */
@customElement('dynamic-list-with-tickets')
export class DynamicListWithTickets extends LitElement {
  static styles = [
    buttonStyles,
    inputStyles,
    linkStyles,
    css`
      h3 {
        font-size: x-large;
        text-transform: capitalize;
        margin-top: 0;
      }
      div.dynamic-list {
        margin: 1em;
        padding: 1em;
        text-align: center;
        vertical-align: top;
        display: inline-block;
      }
      div.list-item {
        margin: 10px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
      }
      .ticket-count {
        background-color: #24d1db;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 0.9em;
      }
      a.disabled {
        color: #e6e6e6;
      }
      .input-container {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
      }
      input[type="number"] {
        width: 80px;
      }
      .help-text {
        font-size: 0.8em;
        color: #666;
        margin-top: 5px;
      }`
  ];

  @property({ type: String })
  name = "Participants";

  @property({ type: Array })
  list: Array<ParticipantWithTickets> = [];

  @query('#participant-input', true)
  _participantInput!: HTMLInputElement;

  @query('#tickets-input', true)
  _ticketsInput!: HTMLInputElement;

  connectedCallback(): void {
    super.connectedCallback();
  }

  override render() {
    const totalTickets = this.list.reduce((sum, participant) => sum + participant.tickets, 0);
    
    return html`
      <div class="dynamic-list">
        <h3>${this.name} (${totalTickets} total tickets)</h3>
        ${this.list.map(
          (participant) =>
            html`
              <div class="list-item">
                <span>${participant.name}</span>
                <span class="ticket-count">${participant.tickets} ticket${participant.tickets > 1 ? 's' : ''}</span>
              </div>
            `
        )}
        <div class="input-container">
          <input id="participant-input" 
                 placeholder="Name" 
                 @keypress=${this._onKeyPress} 
                 @paste=${this._onPaste}>
          <input id="tickets-input" 
                 type="number" 
                 min="1" 
                 value="1" 
                 placeholder="Tickets"
                 @keypress=${this._onKeyPress}>
          <a @click=${this._onClick} part="button">Add</a>
        </div>
        <div class="help-text">
          Format: "name:tickets" or just "name" (defaults to 1 ticket)
        </div>
      </div>
    `;
  }

  private _onClick() {
    this._addParticipant(this._participantInput.value, parseInt(this._ticketsInput.value) || 1);
  }

  private _onPaste(e: ClipboardEvent) {
    const rawPasteData: string = e.clipboardData?.getData("text") ?? "";
    this._parseAndAddParticipants(rawPasteData);
    e.preventDefault();
  }
  
  private _onKeyPress (e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._addParticipant(this._participantInput.value, parseInt(this._ticketsInput.value) || 1);
    }
  }

  private _parseAndAddParticipants(input: string) {
    if (!input || input.length == 0) {
      return;
    }

    const lines = input.split(/[\r?\n;]+/);
    const newParticipants: ParticipantWithTickets[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Check if line contains name:tickets format
      const parts = trimmedLine.split(':');
      if (parts.length === 2) {
        const name = parts[0].trim();
        const tickets = parseInt(parts[1].trim()) || 1;
        if (name) {
          newParticipants.push({ name, tickets });
        }
      } else {
        // Default to 1 ticket if no count specified
        newParticipants.push({ name: trimmedLine, tickets: 1 });
      }
    }

    if (newParticipants.length > 0) {
      this.list = this.list.concat(newParticipants);
      this._dispatchListChanged();
      this._participantInput.value = '';
    }
  }

  private _addParticipant(name: string, tickets: number) {
    if (!name || name.trim().length === 0) {
      return;
    }

    const trimmedName = name.trim();
    
    // Check if name contains tickets info
    if (trimmedName.includes(':')) {
      this._parseAndAddParticipants(trimmedName);
      return;
    }

    this.list = [...this.list, { name: trimmedName, tickets: tickets || 1 }];
    this._dispatchListChanged();

    this._participantInput.value = '';
    this._ticketsInput.value = '1';
  }

  private _dispatchListChanged() {
    const options = {
      detail: { name: this.name, list: this.list },
      bubbles: true,
      composed: true
    };

    this.dispatchEvent(new CustomEvent('list-changed', options));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dynamic-list-with-tickets': DynamicListWithTickets;
  }
}