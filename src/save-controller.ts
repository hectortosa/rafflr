import {ReactiveController, LitElement} from 'lit';

export class SaveController implements ReactiveController {
    host: LitElement;

    menu: string;

    constructor(host: LitElement, menu: string) {
        (this.host = host).addController(this);
        this.menu = menu;
    }

    async save(setup: { [key: string]: string[] | string | boolean }) {
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(setup)) {
            if (Array.isArray(value)) {
                params.set(key, value.join(';'));
            } else {
                params.set(key, value.toString());
            }
        }

        let rafflrUrl = window.location.origin + "/" + this.menu + "?" + params.toString();

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