# React Raffle

[![Heroku](http://heroku-badge.herokuapp.com/?app=react-raffle&style=flat&svg=1)](https://react-raffle.herokuapp.com/)

This simple application was made to learn [React](https://github.com/facebook/react). It is a serverless app so the raffle logic part is performed in a [Auth0 WebTask](https://webtask.io/).

It is so simple to use:

- Introduce prizes names in the **Prizes** column (press `Enter` to introduce them)
- Introduce participants in the **Participants** column (press `Enter` to introduce them)
- Click the **Start Raffle** button
- The pirzes assignements will be shown

> Shuffle algorithm implemented in the WebTask is based on [Fisher-Yates shuffle Wikipedia article](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).

## Quick start

To run the app simply follow this steps:

- Clone the repo: git clone https://github.com/hectortosa/react-raffle.git
- Install dependencies: `yarn install`or `npm install`
- Run the app: `yarn start` or `npm start`

## Tech stack

### Tools

- [Create React App](https://github.com/facebookincubator/create-react-app)
- [Yarn](https://yarnpkg.com/en/)

### Web

- [React](https://github.com/facebook/react)
- [Bootstrap](https://github.com/twbs/bootstrap)
- [Request](https://github.com/request/request)

### Serverless

- [WebTask](https://webtask.io/)
