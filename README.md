# React Raffle

[![Heroku](http://heroku-badge.herokuapp.com/?app=react-raffle&style=flat&svg=1)](https://react-raffle.herokuapp.com/)

This simple application was made to learn [React][reactjs]. It is a serverless app so the raffle logic part is performed in a [Auth0 Webtasks][webtasks] made with [Serverless Framework][serverless], but any other [Serverless Infrastructure Provider](https://serverless.com/framework/docs/providers/) can be used, like [Google Cloud Functions][gcfunctions]. The serverless code for Webtasks and Google Cloud Functions and the Serverless configuration file (serverless.yml) are included under `serverless` folder.

It is so simple to use:

- Introduce prizes names in the **Prizes** column (press `Enter` to introduce them)
- Introduce participants in the **Participants** column (press `Enter` to introduce them)
- Click the **Start Raffle** button
- The pirzes assignements will be shown

> Shuffle algorithm implemented in the WebTask is based on [Fisher-Yates shuffle Wikipedia article](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).

## Quick start

To run the app simply follow this steps:

- Clone the repo: `git clone https://github.com/hectortosa/react-raffle.git`
- Install dependencies: `yarn install`or `npm install`
- Run the app: `yarn start` or `npm start`

## Tech stack

### Tools

- [Create React App](https://github.com/facebookincubator/create-react-app)
- [Yarn](https://yarnpkg.com/en/)

### Web

- [React][reactjs]
- [Bootstrap](https://github.com/twbs/bootstrap)
- [Request](https://github.com/request/request)

### Serverless

- [Serverless Framework][serverless]
- [Auth0 Webtasks][webtasks]
- [Google Cloud Functions][gcfunctions]

[reactjs]: https://github.com/facebook/react "ReactJS"
[serverless]: https://serverless.com/ "Serverless Framework"
[webtasks]: https://webtask.io/ "Auth0 Webtasks"
[gcfunctions]: https://cloud.google.com/functions/ "Google Cloud Functions"
