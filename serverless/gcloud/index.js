'use strict';

var cors = require('cors');
var shufflr = require('shufflr');

exports.http = (request, response) => {
  var corsFn = cors();
  corsFn(request, response, function() {
    runRuffle(request, response);
  });
};

function runRuffle(request, response) {
  var prizes = [],
    participants = [],
    unnasignedName = "",
    participantsList = [],
    result = {},
    i;

  if (!request.body.prizes || !Array.isArray(request.body.prizes)) {
    response.status(400).send('Unexpected payload: Missing prizes list.');
    return;
  }

  prizes = request.body.prizes;

  if (!request.body.participants || !Array.isArray(request.body.participants)) {
    response.status(400).send('Unexpected payload: Missing participants list.');
  }

  participants = request.body.participants;

  unnasignedName = request.body.unnasignedName || "Unnasigned";

  participantsList = buildParticipantsList(participants, prizes.length, unnasignedName);

  prizes = shufflr.shuffle(prizes);
  participantsList = shufflr.shuffle(participantsList);

  for (i = 0; i < prizes.length; i++) {
    getOrAddProperty(result, participantsList[i], []).push(prizes[i]);
  }

  response.status(200).send(result);
};

function buildParticipantsList(participants, numberOfPrizes, spareParticipant) {
  var assignement,
    toShare,
    i,
    result = [];
    
  if (numberOfPrizes <= participants.length) {
    return participants;
  }

  assignement = Math.floor(numberOfPrizes / participants.length);
  toShare = numberOfPrizes - (assignement * participants.length);
  
  for (i = 0; i < assignement; i++) {
    result = result.concat(participants);
  }
  
  for (i = 0; i < toShare; i++) {
    result.push(spareParticipant);
  }
  
  return result;
}

function getOrAddProperty(object, property, initializer) {
  if (!object[property]) {
    object[property] = initializer;
  }
  
  return object[property];
}