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
        margin: 10px 0;
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        position: relative;
        transition: all 0.1s cubic-bezier(0.17, 0.67, 0.5, 0.71);
        padding: 8px 12px;
        border-radius: 3px;
        border: 1px solid transparent;
      }
      div.list-item:hover:not(.editing) {
        border-color: #24d1db;
        box-shadow: #24d1db 1px 1px 0px 0px;
        cursor: pointer;
      }
      div.list-item.editing {
        border-color: #24d1db;
        box-shadow: #24d1db 1px 1px 0px 0px;
      }
      .item-content {
        flex: 1;
        min-width: 0;
        text-align: left;
      }
      .item-actions {
        display: flex;
        gap: 12px;
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
        flex: 1;
        padding: 4px 8px;
        font-size: 1em;
      }
      a.disabled {
        color: #e6e6e6;
      }
      
      /* Dark mode styles */
      @media (prefers-color-scheme: dark) {
        .edit-input {
          background-color: rgb(45, 45, 45);
          border: 1px solid rgb(45, 45, 45);
          color: rgb(230, 230, 230);
        }
        
        .edit-input:focus {
          background-color: rgb(240, 240, 240);
          color: rgb(10, 10, 10);
          border-color: #24d1db;
        }
      }
      .input-section {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
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
              <div class="list-item ${this._editingIndex === index ? 'editing' : ''}" 
                   @click=${() => this._editingIndex !== index && this._startEdit(index, listItem)}>
                ${this._editingIndex === index
                  ? html`
                      <input 
                        class="edit-input"
                        type="text" 
                        .value=${this._editValue}
                        @input=${(e: Event) => this._editValue = (e.target as HTMLInputElement).value}
                        @keypress=${(e: KeyboardEvent) => this._onEditKeyPress(e, index)}
                        @click=${(e: Event) => e.stopPropagation()}
                      />
                      <div class="item-actions">
                        <a @click=${(e: Event) => { e.stopPropagation(); this._saveEdit(index); }} part="button">Save</a>
                        <a @click=${(e: Event) => { e.stopPropagation(); this._cancelEdit(); }} part="button">Cancel</a>
                      </div>
                    `
                  : html`
                      <div class="item-content">${listItem}</div>
                      <div class="item-actions">
                        <a @click=${(e: Event) => { e.stopPropagation(); this._startEdit(index, listItem); }} part="button">Edit</a>
                        <a @click=${(e: Event) => { e.stopPropagation(); this._deleteItem(index); }} part="button">Remove</a>
                      </div>
                    `
                }
              </div>
            `
        )}
        <div class="input-section">
          <input id="add-input" @keypress=${this._onKeyPress} @paste=${this._onPaste}>
          <a @click=${this._onClick} part="button">Add</a>
        </div>
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
