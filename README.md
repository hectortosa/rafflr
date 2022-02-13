
# Rafflr App

[![Azure Static Web Apps CI/CD](https://github.com/hectortosa/rafflr/actions/workflows/build-and-deploy-azure-static-webapp.yml/badge.svg)](https://github.com/hectortosa/rafflr/actions/workflows/build-and-deploy-azure-static-webapp.yml)

This is a simple app to do Raffles.

![Screenshot of the app](screenshot.png)

## General usage

### Adding multiple items

You can add several entries at the same time separated by semi-colon `;`.

### Saving setup

You can save your current setup by clicking in **Save** link. This will generate the url with the current setup to the clipboard (note tihs might not work on all borwsers if they don't support it).

## Raffle prizes

To use it, just add as many prizes and participants as you want by simply entering the value and pressing `Enter` or click `Add`. Press **Raffle** button to perform the raffle.

When the Raffle is performed, if there are more prizes than participants, and prizes cannot be equitably assigned to all participants, some prizes will be **To Share**, because sharing is caring.

## Lucky One

In this type of raffle, there is no need to add a list of prizes. The Lucky One will be selected randomly from the list of participants.
