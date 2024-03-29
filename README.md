
# Rafflr App

[🔗 Rafflr Site](https://rafflr.codesharegrow.net/)

[![Azure Static Web Apps CI/CD](https://github.com/hectortosa/rafflr/actions/workflows/build-and-deploy-azure-static-webapp.yml/badge.svg)](https://github.com/hectortosa/rafflr/actions/workflows/build-and-deploy-azure-static-webapp.yml)

This is a simple app to do Raffles.

![Screenshot of the app](screenshot.png)

## General usage

### Adding multiple items

Every list of participants, prices, team members, etc, supports pasting a list of items, using each line of the content pasted as an item to add to the list. It will also use semi-colon `;` as item separator.

You can also add several entries at the same time by writing them in one go separated by semi-colon `;`.

### Saving setup

You can save your current setup by clicking in **Copy setup** link. This will generate the URL with the current setup and copy it to the clipboard (note this might not work on all borwsers if they don't support Clipboard API).

## Dice Roll

This will simulate a dice roll. You can configure the number of dices and the sides of them using [standard dice notation](https://en.wikipedia.org/wiki/Dice_notation) in the _Dice Setup_ input. To use more than one type od dice, enter more than one standard notation separated by colon `;`.

For example, to roll 2 dices with 6 sides each, plus 1 dice of 20 sides, you would enter `2d6;1d20` in the _Dice Setup_ input.

## Lucky One

This will randomly pick one item from the list of _Participants_. If _Remove pick_ is checked, the picked item from the _Participants_ list will be removed and picked will be kept.

_Copy setup_ will also copy the list of picked items if _Remove pick_ is checked.

## Raffle Prizes

To use it, just add as many prizes and participants as you want by simply entering the value and pressing `Enter` or click `Add`. Press **Raffle** button to perform the raffle.

When the Raffle is performed, if there are more prizes than participants, and prizes cannot be equitably assigned to all participants, some prizes will be **To Share**, because sharing is caring.

## Random Teams

This will create random teams from the list of participants. The number of members per team is indicated with the _Team Size_ input. Simply add the desired team size, the participants, and click on **Team Up** button.

If participants cannot be evenly distributed, the last team will have the remaining participants.

## Shuffle Order

This will simply re-order the participants list. Simply add the participants and click on **Shuffle** button.

## Development

Rafflr uses [PNPM](https://pnpm.io/) + [Vite](https://vitejs.dev/) + [Lit](https://lit.dev/) + [TypeScript](https://www.typescriptlang.org/) (and their respectives required dependencies like Node).

To quickly setup your local environment, run

```bash
pnpm i
```

then

```bash
pnpm run dev
```

## :heart: Like the project?

If you like this project (or [any other](https://github.com/hectortosa)) and want to help me contiue to improve it or create new ones, check my Ko-fi profile and consider buying me a Speciality Coffee:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/H2H3P6FO7)