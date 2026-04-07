import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import confetti from 'canvas-confetti';

import './dynamic-list';
import './result-panel';
import { SaveController } from './save-controller';
import { formTeams, type Team } from './random-teams.logic';

import { buttonStyles } from './styles/button-styles';
import { linkStyles } from './styles/link-styles';
import { inputStyles } from './styles/input-styles';

@customElement('random-teams')
export class RandomTeams extends LitElement {
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
            width: 50px;
          }
          footer {
            display: flex;
            flex-direction: column;
          }
          span {
            margin-block-start: 4em;
          }
    `];

    @state()
    protected _teamSize: number = 3;

    @state()
    protected _participants: Array<string> = [];

    @state()
    protected _resultedTeams: Array<Team> = [];

    @state()
    protected _teamUpEnded: boolean = false;

    private saveController: SaveController = new SaveController(this, "random-teams");

    constructor() {
        super();

        let params = new URLSearchParams(window.location.search);
        let initialParticipants = params.get("participants")?.split(";");
        let initialTeamSize = params.get("teamSize")
            ? parseInt(params.get("teamSize") as string, 10)
            : 3;

        if (initialParticipants) {
            this._participants = initialParticipants;
        }

        if (initialTeamSize) {
            this._teamSize = initialTeamSize;
        }
    }

    override render() {
        return html`
          <div @list-changed=${this._onItemsChanged}>
            <header>
              <h1>Random Teams</h1>
            </header>
            <div class="input-group">
                <label for="Team Size">Team Size</label>
                <input type="number" name="Size" .value=${this._teamSize} @change=${this._onSizeChange}></input>
            </div>
            <dynamic-list name="Participants" .list=${this._participants}></dynamic-list>
            <footer>
              <button id="random-teams-run" ?disabled=${!this._canTeamUp()} @click=${this._runWithDelay}>Team Up</button>
              <a @click=${this._save} part="button">Copy setup</a>
            </footer>
            <div class="winners-panel">
              <span ?hidden=${!this._teamUpEnded}>👥</span>
              ${this._resultedTeams.map(
                (resultItem) =>
                html`
                    <result-panel title=${resultItem.name} .result=${resultItem.members}></result-panel> 
                `
              )}
              <span ?hidden=${!this._teamUpEnded}>👥</span>
            </div>
          </div>
        `;
    }

    private _save() {
        let setupToSave = { participants: this._participants, teamSize: Array<string>(1).fill(this._teamSize.toString(10)) };
        this.saveController.save(setupToSave);
    }

    private _canTeamUp(): boolean {
        return this._teamSize > 1 && this._participants.length > 1;
    }

    private _onSizeChange (e: Event) {
        this._teamSize = parseInt((e.target as HTMLInputElement).value, 10);
    }

    private _onItemsChanged(e: CustomEvent) {
        if (e.detail.name === "Participants") {
            this._participants = e.detail.list;
        }
    }

    private sleep(millis: number) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }

    private async _runWithDelay() {
        this._teamUpEnded = false;

        if (this._canTeamUp()) {
            for (let i = 0; i < 15; i++) {
                await this.sleep(i < 10 ? 100 : 50 * i);
                this._teamUp();
            }
        }

        await this.sleep(300);

        confetti({ particleCount: 100, origin: { x: 0.5, y: 0.8 } });
        this._teamUpEnded = true;
    }

    private _teamUp() {
        this._resultedTeams = formTeams(this._participants, this._teamSize);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'random-teams': RandomTeams;
    }
}
