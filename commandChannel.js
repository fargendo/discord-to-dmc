const Discord = require('discord.js')
const WebSocket = require('ws')
const receive = require('./ws/receive')
const pm2 = require('pm2')
require('dotenv').config()

const client = new Discord.Client()

const URL = 'ws://localhost:9000'
ws = new WebSocket(URL)

const commandChannelId = '841481657026478170'
const webhookId = '717064852363018300'
const masterAuthorId = '123577074710609924'

ws.on('message', function incoming(data) {
	receive(data, client, commandChannelId)
})

client.once('ready', () => {
	console.log('Discord bot online!')
})

client.on('message', message => {
	// require messages to be in #server_chat
	if (message.channel.id === commandChannelId) {
		// parse messages from webhook bot
		if (message.author.id !== webhookId) {
			const content = message.content
			console.log('base message: ' + content)
			if (content.length <= 256 && content.startsWith('!status')) {
				//!status command
				let msg = {
					type: 'status',
				}

				ws.send(JSON.stringify(msg))
			}
			if (
				content.length <= 256 &&
				content.startsWith('!restart') &&
				message.author.id == masterAuthorId
			) {
				let botName = message.content.split(' ')
				botName = botName[1]
				console.log(botName)
				msg = {
					type: 'restart',
					botName: botName,
				}

				ws.send(JSON.stringify(msg))
			}
			if (
				content.length <= 256 &&
				content.startsWith('!stop') &&
				message.author.id == masterAuthorId
			) {
				let botName = message.content.split(' ')
				botName = botName[1]
				console.log(botName)
				pm2.stop(botName)
			}
			if (
				content.length <= 256 &&
				content.startsWith('!start') &&
				message.author.id == masterAuthorId
			) {
				let botName = message.content.split(' ')
				botName = botName[1]
				console.log(botName)
				pm2.start(botName)
			}
		}
	}
})

client.login(process.env.BOT_TOKEN)
