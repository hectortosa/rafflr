import {ReactiveController, LitElement} from 'lit';

export class SaveController implements ReactiveController {
    host: LitElement;

    menu: string;

    constructor(host: LitElement, menu: string) {
        (this.host = host).addController(this);
        this.menu = menu;
    }

    async save(setup: { [key: string]: string[] }) {
        const params = new URLSearchParams();
        params.set('menu', this.menu);

        for (const [key, value] of Object.entries(setup)) {
            params.set(key, value.join(';'));
        }

        let rafflrUrl = window.location.origin + "?" + params.toString();

        await navigator.clipboard.writeText(rafflrUrl);
        
        this.host.dispatchEvent(new CustomEvent('setup-saved', {
            detail: {
                message: "Link with current setup copied to clipboard"
            },
            bubbles: true,
            composed: true
        }));
    }
    
    hostConnected() {
    }
    
    hostDisconnected() {
    }
}