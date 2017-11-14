import React, { Component } from 'react';
import logo from './images/header.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header row">
        <div className="col">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>React Raffle</h1>
          </div>
        </div>
        <Lottery prizesName="Prizes" participantsName="Participants" />
      </div>
    );
  }
}

class Lottery extends Component {
  constructor (props) {
    super(props);

    this.state = {
      results: [],
      newPrize: "",
      newParticipant: ""
    };

    this.runLottery = this.runLottery.bind(this);
    this.getResults = this.getResults.bind(this);

    this.handlePizesChange = this.handlePizesChange.bind(this);
    this.addPrize = this.addPrize.bind(this);

    this.handleParticipantsChange = this.handleParticipantsChange.bind(this);
    this.addParticipant = this.addParticipant.bind(this);

    this.participantList = [];
    this.prizeList = [];

    this.participants = [];
    this.prizes = [];
  }

  render () {
    return (
      <div>
        <div className="row">
          <div className="col">
            <DynamicList value={this.state.newPrize} name={this.props.prizesName} listItems={this.prizeList}
              onSubmit={this.addPrize} onChange={this.handlePizesChange} />
          </div>
          <div className="col">
            <DynamicList value={this.state.newParticipant} name={this.props.participantsName} listItems={this.participantList}
              onSubmit={this.addParticipant} onChange={this.handleParticipantsChange} />
          </div>
        </div>
        <div className={"row"}>
          <div className={"col"}>&nbsp;</div>
        </div>
        <LotteryResults value={this.state.results} />
        <div className={"row"}>
          <div className={"col"}>&nbsp;</div>
        </div>
        <div className="row">
          <div className="col">
            <button onClick={this.runLottery}>Start Raffle</button>
          </div>
        </div>
        <div className={"row"}>
          <div className={"col"}>&nbsp;</div>
        </div>
      </div>
    );
  }

  runLottery (event) {
    var request = require("request"),
      requestOptions = {
        uri: "https://wt-773198c4400b904deded251f7813917d-0.sandbox.auth0-extend.com/raffle-dev-main",
        method: "POST",
        json: true,
        body: { prizes: this.prizes, participants: this.participants, unnasignedName: "To Share" }
      };

    request(requestOptions, this.getResults);
  }

  getResults (error, response, body) {
    if (response && response.statusCode === 200) {
      this.setState({ results: body });
    }
  }

  handlePizesChange (event) {
    this.setState({ newPrize: event.target.value });
  }

  addPrize(event) {
    this.prizeList.push(<div key={this.state.newPrize}>{this.state.newPrize}</div>);
    this.prizes.push(this.state.newPrize);

    this.setState({ newPrize: "" });

    event.preventDefault();
  }

  handleParticipantsChange(event) {
    this.setState({ newParticipant: event.target.value });
  }

  addParticipant(event) {
    this.participantList.push(<div key={this.state.newParticipant}>{this.state.newParticipant}</div>);
    this.participants.push(this.state.newParticipant);

    this.setState({ newParticipant: "" });

    event.preventDefault();
  }
}

class LotteryResults extends Component {
  constructor (props) {
    super(props);

    this.generateWinner = this.generateWinner.bind(this);
  }

  renderWinners () {
    const winners = Object.keys(this.props.value).map(this.generateWinner);

    return winners;
  }

  generateWinner (winner, index) {
    return <Winner key={winner} name={winner} prizes={this.props.value[winner]} />
  }

  render () {
    return(
      <div className={"row"} >
        {this.renderWinners()}
      </div>
    );
  }
}

class Winner extends Component {
  render () {
    return(
      <div className={"col"}>
        <h3 className="Section-title">{this.props.name}</h3>
        {this.props.prizes.map(function (prize, index) {
          return <div key={index}>{prize}</div>
        })}
    </div>
    );
  }
}

class DynamicList extends Component {
  render() {
    return (
      <div>
        <h3 className="Section-title">{this.props.name}</h3>
        <div>
          {this.props.listItems}
        </div>
        <form onSubmit={this.props.onSubmit}>
          <input type="text" value={this.props.value} onChange={this.props.onChange} />
        </form>
      </div>
    );
  }
}

export default App;
