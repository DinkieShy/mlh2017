var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var execFile = require('child_process').execFile;
var fs = require('fs');
var re = /([0-9]+)d([0-9]+)\+?([0-9]*)/;
var cmd = require('node-cmd');
var result = '';
var script;



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
			case 'pong':
				bot.sendMessage({
					to: channelID,
					message: 'Ping!'
				});
			break;
			case 'roll':
				var roll = re.exec(message.slice(6, message.length));
				if (roll != null){
					var toSend = user + " rolled: " + rollDie(parseInt(roll[1]), parseInt(roll[2]), roll[3]);
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
					var toSend = user + " rolled: " + rollDie(parseInt(roll[1]), parseInt(roll[2]), roll[3]);
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
			case 'DinkbotHelp':
				bot.sendMessage({
					to:channelID,
					message: "Commands:\n!DinkbotHelp - display this menu\n!bf [insert brainfuck here]  interprets brainfuck! Try converting a string here: https://copy.sh/brainfuck/text.html !\n!roll xdy or !r xdy - roll x amount of y sided die\n!Ping - Pong!\n!Pong - Ping!"
				})
			break;
			case 'echo':
				message = message.slice(6, message.length);
				bot.sendMessage({
					to:channelID,
					message: message
				})
			break;
			case 'bf':
				result = '';
				code = message.slice(4, message.length);
				logger.info('code: ' + code);
				var script = execFile(__dirname  + '/scripts/BFInterpreter.exe', [code]);
				script.stdout.on('data', function(data, err){
					if(err){
						logger.info('data in err: ' + err);
					}
					if(data != undefined){
						result += data.toString();
						logger.info(('result so far: ' + result));
						logger.info(('data in: ' + data));
					}
				});
				script.on('close', function(err){
					if(err){
						logger.info(('data out err: ' + err));
					}
					logger.info(('result: ' + typeof result + " " + result));
					logger.info('ready to output');
					bot.sendMessage({
						to: channelID,
						message: result
					});
				});
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