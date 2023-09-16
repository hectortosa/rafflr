import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import {
  provideFluentDesignSystem,
  fluentTooltip
} from "@fluentui/web-components";

import confetti from 'canvas-confetti';
import { shuffle } from 'shufflr';

import './dynamic-list';
import './result-panel';
import { SaveController } from './save-controller';

import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';
import { inputStyles } from './styles/input-styles';

provideFluentDesignSystem()
  .register(
    fluentTooltip()
  );

declare class Dice {
  sides: number;
  value: number;
}

@customElement('dice-roll')
export class DiceRoll extends LitElement {
  static override styles = [
    buttonStyles,
    inputStyles,
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
          input {
            width: 200px;
          }
          footer {
            margin-block-start: 4em;
            display: flex;
            flex-direction: column;
          }
          span {
            margin-block-start: 4em;
          }
    `];

  @state()
  protected _diceSetup: string = "1D6";

  @state()
  protected _dices: Array<Dice> = [];

  @state()
  protected _resultedRoll: Array<Dice> = [];

  @state()
  protected _rollEnded: boolean = false;

  private saveController: SaveController = new SaveController(this, "dice-roll");

  constructor() {
    super();

    let params = new URLSearchParams(window.location.search);
    this._diceSetup = params.get("diceSetup") || "2d6;1d20";
    let initialDices = this._generateDicesFromDiceSetup(this._diceSetup);

    if (initialDices) {
      this._dices = initialDices;
    }
  }

  override render() {
    return html`
          <div}>
            <header>
              <h1>Dice Roll</h1>
            </header>
            <div class="input-group">
                <label for="Dice Setup">Dice Setup (using <a href="https://en.wikipedia.org/wiki/Dice_notation" target="_blank">standard dice notation</a>)</label>
                <input type="text" name="Dice Setup" .value=${this._diceSetup} @change=${this._onDiceSetupChange}></input>
            </div>
            <footer>
              <button ?disabled=${!this._canRoll()} @click=${this._runWithDelay}>Roll Dices</button>
              <a @click=${this._save} part="button">Copy setup</a>
            </footer>
            <div class="winners-panel">
              <span ?hidden=${!this._rollEnded}>🎲</span>
              ${this._resultedRoll.map(
      (resultItem) =>
        html`
                    <result-panel title=${"d" + resultItem.sides} .result=${Array(1).fill(resultItem.value)}></result-panel> 
                `
    )}
              <span ?hidden=${!this._rollEnded}>🎲</span>
            </div>
          </div>
        `;
  }

  private _canRoll(): boolean {
    return this._dices.length > 0;
  }

  private _save() {
    let setupToSave = { diceSetup: this._generateDiceSetupArray(this._dices) };
    this.saveController.save(setupToSave);
  }

  /**
   * Generates an array of dice setup strings,
   * where each string is of format NDS,
   * where N is the number of dices of the sime sides and S is the number of sides
   * @param dices The array of dices.
   */
  private _generateDiceSetupArray(dices: Array<Dice>): Array<string> {
    let diceCountBySides = new Map<string, number>();

    dices.forEach(dice => {
      let diceType = "d" + dice.sides.toString();
      let diceCount = diceCountBySides.get(diceType) || 0;
      diceCountBySides.set(diceType, diceCount + 1);
    });

    let diceSetupArray = new Array<string>();

    diceCountBySides.forEach((diceCount, diceType) => {
      diceSetupArray.push(diceCount.toString() + diceType);
    });

    return diceSetupArray;
  }

  private _onDiceSetupChange(e: Event) {
    this._diceSetup = (e.target as HTMLInputElement).value;
    this._dices = this._generateDicesFromDiceSetup(this._diceSetup);
  }

  /**
 * Generates an array of dices from a quick setup string 
 * of comma separated dice setup of format 2D20,
 * where 2 is the number of dices and 20 is the number of sides.
 * @param diceSetup The quick setup string.
 * @returns An array of dices.
 */
  private _generateDicesFromDiceSetup(diceSetup: string): Array<Dice> {
    return diceSetup.toLowerCase().split(";").map(dice => {
      let diceParts = dice.split("d");
      return Array<Dice>(parseInt(diceParts[0], 10)).fill({ sides: parseInt(diceParts[1], 10), value: 1 });
    }).flat();
  }

  private _sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  private async _runWithDelay() {
    this._rollEnded = false;

    if (this._canRoll()) {
      for (let i = 0; i < 15; i++) {
        await this._sleep(i < 10 ? 100 : 50 * i);
        this._diceRoll();
      }
    }

    await this._sleep(300);

    confetti({ particleCount: 100, origin: { x: 0.5, y: 0.8 } });
    this._rollEnded = true;
  }

  private _diceRoll() {
    let roll: Array<Dice> = new Array<Dice>();

    this._dices.forEach(dice => {
      const diceSides = Array<number>(dice.sides).fill(0).map((_, index) => index + 1);
      const result: number = shuffle(diceSides)[0];

      roll.push({ sides: dice.sides, value: result });
    });

    this._resultedRoll = roll;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dice-roll': DiceRoll;
  }
}
