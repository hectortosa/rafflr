'use strict';

var shufflr = require('shufflr');

module.exports = function(request, response) {
  runRuffle(request, response);
};

function runRuffle(request, response) {
  var prizes = [],
    participants = [],
    unnasignedName = "",
    participantsList = [],
    result = {},
    i,
    err;

  if (!request.body.prizes || !Array.isArray(request.body.prizes)) {
    err = new Error('Unexpected payload: Missing prizes list.');
    return request(err);
  }

  prizes = request.body.prizes;

  if (!request.body.participants || !Array.isArray(request.body.participants)) {
    err = new Error('Unexpected payload: Missing participants list.');
    return request(err);
  }

  participants = request.body.participants;

  unnasignedName = request.body.unnasignedName || "Unnasigned";

  participantsList = buildParticipantsList(participants, prizes.length, unnasignedName);

  prizes = shufflr.shuffle(prizes);
  participantsList = shufflr.shuffle(participantsList);

  for (i = 0; i < prizes.length; i++) {
    getOrAddProperty(result, participantsList[i], []).push(prizes[i]);
  }

  response(null, result);
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