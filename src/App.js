import React, { Component } from 'react';
import { shuffle } from 'shufflr';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>Rafflr App</h1>
        </div>
        <Lottery className="main-content" prizesName="Prizes" participantsName="Participants" />
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
    this.runLotteryWithDelay = this.runLotteryWithDelay.bind(this);
    this.sleep = this.sleep.bind(this);
    this.decorateWinners = this.decorateWinners.bind(this);

    this.buildParticipantsList = this.buildParticipantsList.bind(this);
    this.getOrAddProperty = this.getOrAddProperty.bind(this);

    this.handlePizesChange = this.handlePizesChange.bind(this);
    this.addPrize = this.addPrize.bind(this);

    this.handleParticipantsChange = this.handleParticipantsChange.bind(this);
    this.addParticipant = this.addParticipant.bind(this);

    this.participantList = [];
    this.prizeList = [];

    this.participants = [];
    this.prizes = [];

    this.results = [];
  }

  render () {
    return (
      <div>
        <div className="row">
          <div className="col">
            <DynamicList value={this.state.newPrize} name={this.props.prizesName} listItems={this.prizeList}
              onAdd={this.addPrize} onItemChange={this.handlePizesChange} />
          </div>
          <div className="col">
            <DynamicList value={this.state.newParticipant} name={this.props.participantsName} listItems={this.participantList}
              onAdd={this.addParticipant} onItemChange={this.handleParticipantsChange} />
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
            <button disabled={false} onClick={this.runLotteryWithDelay}>Start Raffle</button>
          </div>
        </div>
        <div className={"row"}>
          <div className={"col"}>&nbsp;</div>
        </div>
      </div>
    );
  }

  sleep(millis) { 
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  async runLotteryWithDelay(event) {
    for (let i = 0; i < 15; i++) {
      await this.sleep(i < 10 ? 100 : 50 * i); 
      this.runLottery();
    }

    this.decorateWinners();

    event.preventDefault();
  }

  runLottery() {
    var participantsList = [],
    shuffledPrizes = [],
    shuffledParticipants = [];

    this.results = [];

    participantsList = this.buildParticipantsList(this.participants, this.prizes.length, "To Share");

    shuffledPrizes = shuffle(this.prizes);
    shuffledParticipants = shuffle(participantsList);

    for (var i = 0; i < this.prizes.length; i++) {
      var currentWinner = this.results.find(element => element.winner === shuffledParticipants[i]);

      if (currentWinner) {
        currentWinner.prizes.push(shuffledPrizes[i])
      } else {
        this.results.push({ winner: shuffledParticipants[i], prizes: [shuffledPrizes[i]] });
      }
    }

    this.results.sort((a, b) => {
      if (a.winner === b.winner) {
        return 0;
      }

      return a.winner < b.winner ? -1 : 1; 
    });
    
    this.setState({ results: this.results });
  }

  decorateWinners() {    
    this.results.forEach((result) => {
      result.winner = "🏆 " + result.winner + " 🏆";
    });

    this.setState({ results: this.results });
  }

  buildParticipantsList(participants, numberOfPrizes, spareParticipant) {
    var assignement,
      toShare,
      result = [];
      
    if (numberOfPrizes <= participants.length) {
      return participants;
    }
  
    assignement = Math.floor(numberOfPrizes / participants.length);
    toShare = numberOfPrizes - (assignement * participants.length);
    
    for (var i = 0; i < assignement; i++) {
      result = result.concat(participants);
    }
    
    for (var j = 0; j < toShare; j++) {
      result.push(spareParticipant);
    }
    
    return result;
  }

  getOrAddProperty(object, property, initializer) {
    if (!object[property]) {
      object[property] = initializer;
    }
    
    return object[property];
  }

  handlePizesChange(event) {
    this.setState({ newPrize: event.target.value });
  }

  addPrize(event) {
    var newEntry = this.state.newPrize;

    newEntry.split(";").forEach((entry) => {
      if(this.prizes.includes(entry.trim())) {
        console.log("price already in the list");
      }
      else {
        this.prizeList.push(<div key={entry.trim()}>{entry.trim()}</div>);
        this.prizes.push(entry.trim());
      }
    });

    this.setState({ newPrize: "" });

    event.preventDefault();
  }

  handleParticipantsChange(event) {
    this.setState({ newParticipant: event.target.value });
  }

  addParticipant(event) {
    var newEntry = this.state.newParticipant;

    newEntry.split(";").forEach((entry) => {
      if (this.participants.includes(entry.trim())) {
        console.log("participant already in the list");
      }
      else {
        this.participantList.push(<div key={entry.trim()}>{entry.trim()}</div>);
        this.participants.push(entry.trim());
      }
    });

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
    const winners = this.props.value.map(this.generateWinner);

    return winners;
  }

  generateWinner (winner, index) {
    return <Winner key={winner.winner} name={winner.winner} prizes={winner.prizes} />
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
  constructor(props) {
    super(props);

    this.addOnEnter = this.addOnEnter.bind(this);
  }

  render() {
    return (
      <div className="dynamic-list">
        <h3 className="Section-title">{this.props.name}</h3>
        <div>
          {this.props.listItems}
        </div>
        <input type="text" value={this.props.value} onChange={this.props.onItemChange} onKeyPress={this.addOnEnter} />
        <a href="" onClick={this.props.onAdd}>Add</a>
      </div>
    );
  }

  addOnEnter (event) {
    if (event.key === 'Enter') {
      this.props.onAdd(event);
    }
  }
}

export default App;
