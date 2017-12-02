var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var re = /([0-9]+)d([0-9]+)\+?([0-9]*)/;

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {colorize: true});

var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on('ready', function(e){
	logger.info('Connected');
	logger.info('Logged in as: ' + bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function(user, userID, channelID, message, e){
	if (message.substring(0, 1) == '!'){
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd){
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
			case 'roll':
				var roll = re.exec(message.slice(6, message.length));
				if (roll != null){
					var toSend = rollDie(parseInt(roll[1]), parseInt(roll[2]), roll[3]);
					bot.sendMessage({
						to:channelID,
						message: toSend.toString()
					})
				}
				else{
					bot.sendMessage({
						to:channelID,
						message: 'Invalid formula!'
					})
				}
			break;
			case 'r':
				var roll = re.exec(message.slice(3, message.length));
				if (roll != null){
					var toSend = rollDie(parseInt(roll[1]), parseInt(roll[2]), roll[3]);
					bot.sendMessage({
						to:channelID,
						message: toSend.toString()
					})
				}
				else{
					bot.sendMessage({
						to:channelID,
						message: 'Invalid formula!'
					})
				}
			break;
			case 'rollp':
				var roll = re.exec(message.slice(7, message.length));
				if (roll != null){
					var toSend = rollDie(parseInt(roll[1]), parseInt(roll[2]), roll[3]);
					bot.sendMessage({
						to:userID,
						message: toSend.toString()
					});
				}
				else{
					bot.sendMessage({
						to:channelID,
						message: 'Invalid formula!'
					})
				}
			break;
			case 'echo':
				message = message.slice(6, message.length);
				bot.sendMessage({
					to:channelID,
					message: message
				})
			break;
         }
     }
});

function rollDie(numberOfDice, numberOfSides, modifier){
	var toSend = 0;
	if (modifier == ""){
		modifier = 0;
	}
	else{
		modifier = parseInt(modifier);
	}
	if (numberOfDice > 1){
		toSend = [];
		for (var i = 0; i < numberOfDice; i++){
			toSend.add(Math.round(Math.random()*numberOfSides)+modifier);
		}
	}
	else{
		toSend += Math.round(Math.random()*numberOfSides)+modifier;
	}
	return toSend;
}