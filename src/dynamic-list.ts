import { LitElement, html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import { buttonStyles } from './styles/button-styles.js';
import { linkStyles } from './styles/link-styles.js';
import { inputStyles } from './styles/input-styles.js';

/**
 * List with input to add items
 *
 * @fires list-changed - Indicates when the list changes
 */
@customElement('dynamic-list')
export class DynamicList extends LitElement {
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
      .item-content {
        flex: 1;
        min-width: 0;
      }
      .item-actions {
        display: flex;
        gap: 5px;
      }
      .action-button {
        cursor: pointer;
        padding: 4px 8px;
        font-size: 0.8em;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        color: #333;
        transition: all 0.2s ease;
      }
      .action-button:hover {
        background-color: #e0e0e0;
        transform: translateY(-1px);
      }
      .edit-button {
        background-color: #e3f2fd;
        border-color: #1976d2;
        color: #1976d2;
      }
      .edit-button:hover {
        background-color: #bbdefb;
      }
      .delete-button {
        background-color: #ffebee;
        border-color: #d32f2f;
        color: #d32f2f;
      }
      .delete-button:hover {
        background-color: #ffcdd2;
      }
      .save-button {
        background-color: #e8f5e9;
        border-color: #388e3c;
        color: #388e3c;
      }
      .save-button:hover {
        background-color: #c8e6c9;
      }
      .cancel-button {
        background-color: #fafafa;
        border-color: #616161;
        color: #616161;
      }
      .cancel-button:hover {
        background-color: #f5f5f5;
      }
      .edit-input {
        flex: 1;
        padding: 4px 8px;
        font-size: 1em;
      }
      a.disabled {
        color: #e6e6e6;
      }`
  ];

  @property({ type: String })
  name = "Items";

  @property({ type: Array })
  list: Array<string> = [];

  @state()
  private _editingIndex: number = -1;

  @state()
  private _editValue: string = "";

  @query('#add-input', true)
  _input!: HTMLInputElement;

  connectedCallback(): void {
    super.connectedCallback();
  }

  override render() {
    return html`
      <div class="dynamic-list">
        <h3>${this.name}</h3>
        ${this.list.map(
          (listItem, index) =>
            html`
              <div class="list-item">
                ${this._editingIndex === index
                  ? html`
                      <input 
                        class="edit-input"
                        type="text" 
                        .value=${this._editValue}
                        @input=${(e: Event) => this._editValue = (e.target as HTMLInputElement).value}
                        @keypress=${(e: KeyboardEvent) => this._onEditKeyPress(e, index)}
                      />
                      <div class="item-actions">
                        <button class="action-button save-button" @click=${() => this._saveEdit(index)}>✓ Save</button>
                        <button class="action-button cancel-button" @click=${() => this._cancelEdit()}>✗ Cancel</button>
                      </div>
                    `
                  : html`
                      <div class="item-content">${listItem}</div>
                      <div class="item-actions">
                        <button class="action-button edit-button" @click=${() => this._startEdit(index, listItem)}>✏️ Edit</button>
                        <button class="action-button delete-button" @click=${() => this._deleteItem(index)}>🗑️ Delete</button>
                      </div>
                    `
                }
              </div>
            `
        )}
        <input id="add-input" @keypress=${this._onKeyPress} @paste=${this._onPaste}>
        <a @click=${this._onClick} part="button">Add</a>
      </div>
    `;
  }

  private _onClick() {
    this._addItems(this._input.value);
  }

  private _onPaste(e: ClipboardEvent) {
    const rawPasteData: string = e.clipboardData?.getData("text") ?? "";
    this._addItems(rawPasteData);
    e.preventDefault();
  }
  
  private _onKeyPress (e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._addItems(this._input.value);
    }
  }

  private _onEditKeyPress(e: KeyboardEvent, index: number) {
    if (e.key === 'Enter') {
      this._saveEdit(index);
    } else if (e.key === 'Escape') {
      this._cancelEdit();
    }
  }

  private _startEdit(index: number, value: string) {
    this._editingIndex = index;
    this._editValue = value;
    // Focus the input after render
    this.updateComplete.then(() => {
      const editInput = this.shadowRoot?.querySelector('.edit-input') as HTMLInputElement;
      if (editInput) {
        editInput.focus();
        editInput.select();
      }
    });
  }

  private _saveEdit(index: number) {
    if (this._editValue.trim() && this._editValue !== this.list[index]) {
      this.list = [
        ...this.list.slice(0, index),
        this._editValue.trim(),
        ...this.list.slice(index + 1)
      ];
      this._dispatchListChanged();
    }
    this._cancelEdit();
  }

  private _cancelEdit() {
    this._editingIndex = -1;
    this._editValue = "";
  }

  private _deleteItem(index: number) {
    if (confirm(`Are you sure you want to delete "${this.list[index]}"?`)) {
      this.list = this.list.filter((_, i) => i !== index);
      this._dispatchListChanged();
    }
  }

  private _addItems(input: string) {
    if (!input || input.length == 0) {
      return;
    }

    const itemsToAdd = input.split(/[\r?\n;]+/).filter(item => item.trim());
    this.list = this.list.concat(itemsToAdd);
    this._dispatchListChanged();

    this._input.value = '';
  }

  private _dispatchListChanged() {
    const options = {
      detail: { name: this.name, list: this.list},
      bubbles: true,
      composed: true
    };

    this.dispatchEvent(new CustomEvent('list-changed', options));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dynamic-list': DynamicList;
  }
}
