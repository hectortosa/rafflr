# Rafflr App
[![Azure Static Web Apps CI/CD](https://github.com/hectortosa/rafflr/actions/workflows/azure-static-web-apps-happy-cliff-03b050f03.yml/badge.svg)](https://github.com/hectortosa/rafflr/actions/workflows/azure-static-web-apps-happy-cliff-03b050f03.yml)

This is a simple app to do Raffles.

![Screenshot of the app](screenshot.png)

To use it, just add as many prizes and participants as you want by simply entering the value and pressing Enter (you can add several entries at the same time separated by semi-colon `;`). Press **Start Raffle** button to perform the raffle.

You can _save_ a Rafflr by adding two query parameters, `Prizes` and `Participants`, with a colon `;` separated list of items. You can also save your current Raffle by clicking in **Copy Rafflr** link below the **Start Raffle** button. This will generate the url with the prizes and participants list set with the current items and copy it to the clipboard (note tihs might not work on all borwsers if they don't support it).

When the Raffle is performed, if there are more prizes than participants, and prizes cannot be equitably assigned to all participants, some prizes will be **To Share**, because sharing is caring.
