import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

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
        position: relative;
        transition: background-color 0.2s ease;
        padding: 8px;
        border-radius: 4px;
      }
      div.list-item:hover:not(.editing) {
        background-color: #f0f0f0;
        cursor: pointer;
      }
      .item-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
      }
      .ticket-count {
        background-color: #24d1db;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 0.9em;
      }
      .item-actions {
        display: flex;
        gap: 5px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      div.list-item:hover .item-actions {
        opacity: 1;
      }
      div.list-item.editing .item-actions {
        opacity: 1;
      }
      .edit-input {
        padding: 4px 8px;
        font-size: 1em;
      }
      .edit-tickets-input {
        width: 60px;
        padding: 4px 8px;
        font-size: 1em;
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

  @state()
  private _editingIndex: number = -1;

  @state()
  private _editName: string = "";

  @state()
  private _editTickets: number = 1;

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
          (participant, index) =>
            html`
              <div class="list-item ${this._editingIndex === index ? 'editing' : ''}" 
                   @click=${() => this._editingIndex !== index && this._startEdit(index, participant)}>
                ${this._editingIndex === index
                  ? html`
                      <input 
                        class="edit-input"
                        type="text" 
                        .value=${this._editName}
                        @input=${(e: Event) => this._editName = (e.target as HTMLInputElement).value}
                        @keypress=${(e: KeyboardEvent) => this._onEditKeyPress(e, index)}
                        @click=${(e: Event) => e.stopPropagation()}
                        placeholder="Name"
                      />
                      <input 
                        class="edit-tickets-input"
                        type="number" 
                        min="1"
                        .value=${this._editTickets}
                        @input=${(e: Event) => this._editTickets = parseInt((e.target as HTMLInputElement).value) || 1}
                        @keypress=${(e: KeyboardEvent) => this._onEditKeyPress(e, index)}
                        @click=${(e: Event) => e.stopPropagation()}
                        placeholder="Tickets"
                      />
                      <div class="item-actions">
                        <a @click=${(e: Event) => { e.stopPropagation(); this._saveEdit(index); }} part="button">Save</a>
                        <a @click=${(e: Event) => { e.stopPropagation(); this._cancelEdit(); }} part="button">Cancel</a>
                      </div>
                    `
                  : html`
                      <div class="item-content">
                        <span>${participant.name}</span>
                        <span class="ticket-count">${participant.tickets} ticket${participant.tickets > 1 ? 's' : ''}</span>
                      </div>
                      <div class="item-actions">
                        <a @click=${(e: Event) => { e.stopPropagation(); this._startEdit(index, participant); }} part="button">Edit</a>
                        <a @click=${(e: Event) => { e.stopPropagation(); this._deleteItem(index); }} part="button">Remove</a>
                      </div>
                    `
                }
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

  private _onEditKeyPress(e: KeyboardEvent, index: number) {
    if (e.key === 'Enter') {
      this._saveEdit(index);
    } else if (e.key === 'Escape') {
      this._cancelEdit();
    }
  }

  private _startEdit(index: number, participant: ParticipantWithTickets) {
    this._editingIndex = index;
    this._editName = participant.name;
    this._editTickets = participant.tickets;
    // Focus the name input after render
    this.updateComplete.then(() => {
      const editInput = this.shadowRoot?.querySelector('.edit-input') as HTMLInputElement;
      if (editInput) {
        editInput.focus();
        editInput.select();
      }
    });
  }

  private _saveEdit(index: number) {
    const trimmedName = this._editName.trim();
    if (trimmedName && (trimmedName !== this.list[index].name || this._editTickets !== this.list[index].tickets)) {
      this.list = [
        ...this.list.slice(0, index),
        { name: trimmedName, tickets: this._editTickets || 1 },
        ...this.list.slice(index + 1)
      ];
      this._dispatchListChanged();
    }
    this._cancelEdit();
  }

  private _cancelEdit() {
    this._editingIndex = -1;
    this._editName = "";
    this._editTickets = 1;
  }

  private _deleteItem(index: number) {
    const participant = this.list[index];
    if (confirm(`Are you sure you want to delete "${participant.name}" with ${participant.tickets} ticket${participant.tickets > 1 ? 's' : ''}?`)) {
      this.list = this.list.filter((_, i) => i !== index);
      this._dispatchListChanged();
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