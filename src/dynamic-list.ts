import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

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
        display: block;
      }
      a.disabled {
        color: #e6e6e6;
      }`
  ];

  @property({ type: String })
  name = "Items";

  @property({ type: Array })
  list: Array<string> = [];

  @query('input', true)
  _input!: HTMLInputElement;

  connectedCallback(): void {
    super.connectedCallback();
  }

  override render() {
    return html`
      <div class="dynamic-list">
        <h3>${this.name}</h3>
        ${this.list.map(
          (listItem) =>
            html`
              <div class="list-item">${listItem}</div>
            `
        )}
        <input @keypress=${this._onKeyPress} @paste=${this._onPaste}>
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

  private _addItems(input: string) {
    if (!input || input.length == 0) {
      return;
    }

    const itemsToAdd = input.split(/[\r?\n;]+/);
    this.list = this.list.concat(itemsToAdd);

    const options = {
      detail: { name: this.name, list: this.list},
      bubbles: true,
      composed: true
    };

    this.dispatchEvent(new CustomEvent('list-changed', options));

    this._input.value = '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dynamic-list': DynamicList;
  }
}
