import {ReactiveController, ReactiveControllerHost} from 'lit';

export class SaveController implements ReactiveController {
    host: ReactiveControllerHost;

    menu: string;

    constructor(host: ReactiveControllerHost, menu: string) {
        (this.host = host).addController(this);
        this.menu = menu;
    }

    save(setup: { [key: string]: string[] }) {
        let queryString = "?menu=" + this.menu;

        for (var key in setup) {
            queryString += "&" + key + "=" + setup[key].join(";");
        }

        let rafflrUrl = window.location.origin + queryString;
    
        navigator.clipboard.writeText(rafflrUrl).then(function() {
            console.info('Rafflr URL copied to clipboard');
        }, function() {
            console.warn('Failed to copy Rafflr URL to clipboard');
        });
    }
    
    hostConnected() {
    }
    
    hostDisconnected() {
    }
}