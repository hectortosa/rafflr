  module.exports = function (ctx, cb) {
    var prizes = [],
      participants = [],
      unnasignedName = "",
      participantsList = [],
      result = {},
      i;
    
    if (!ctx.body.prizes || !Array.isArray(ctx.body.prizes)) {
        err = new Error('Unexpected payload: Missing prizes list.');
        return cb(err);
    }
    
    prizes = ctx.body.prizes;
    
    if (!ctx.body.participants || !Array.isArray(ctx.body.participants)) {
        err = new Error('Unexpected payload: Missing participants list.');
        return cb(err);
    }
    
    participants = ctx.body.participants;

    unnasignedName = ctx.body.unnasignedName || "Unnasigned";
    
    participantsList = buildParticipantsList(participants, prizes.length, unnasignedName);
    
    prizes = shuffleList(prizes);
    participantsList = shuffleList(participantsList);
    
    for (i = 0; i < prizes.length; i++) {
    	getOrAddProperty(result, participantsList[i], []).push(prizes[i]);
    }
    
    cb(null, result);
  };
  
  function shuffleList(list, randomDigits) {
    var shuffleItem,
      i, j;

    if (list.length <= 2) {
      return list;
    }
    
    randomDigits = randomDigits || 10000
    
    for (i = 0; i < list.length-2; i++) {
      j = (Math.round(Math.random() * randomDigits) + i) % list.length;
    
      shuffleItem = list[i];
      list[i] = list[j];
      list[j] = shuffleItem;
    }
    
    return list;
  }
  
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
