var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {colorize: true});

var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on('ready', function(e){
	logger.info('Connected');
	logger.info('Logged in as: ');
	logger.info(bot.unsername + ' - (' + bot.id + ')');
});

bot.on('message', function(user, userID, channelID, message, e){
	if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
			case 'roll':
				bot.sendMessage({
					to:channelID,
					message: 'I can\'t do that yet ;-;'
				})
			break;
			case 'pytest':
				$.ajax({
					type: 'GET',
					url: '/pyscripts/roll.py',
					data: {param:" "},
					dataType: 'text',
					success: function(response){
						logger.info('SUCCESS: ' + response);
					},
					error: function(response){
						logger.info('ERROR: ' + response);
					}
				}).done(function(o){
					logger.info('OK');
				});
			break;
         }
     }
});