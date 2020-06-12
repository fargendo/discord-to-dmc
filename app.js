const Discord = require('discord.js')
const WebSocket = require('ws')
require('dotenv').config()

const client = new Discord.Client()

const URL = 'ws://localhost:9000'
ws = new WebSocket(URL)

client.once('ready', () => {
	console.log('Discord bot online!')
})

client.on('message', message => {
	// require messages to be in #server_chat
	if (message.channel.id === '703037445201068032') {
		// parse messages from webhook bot
		if (message.author.id !== '706667912613593098') {
			console.log('message received from #server_chat')
			const msg = {
				message: '[' + message.author.username + ']:  ' + message.content,
				type: 'dmcchat',
			}
			if (msg.message.length <= 256) {
				ws.send(JSON.stringify(msg))
			}
		}
	}
	// Don fuer Party chat
	if (message.channel.id === '718912872432009216') {
		// webhook bot
		if (message.author.id !== '718914956023824518' && message.author.id !== '163016436854423553') {
			console.log('message received from donfuer #party_chat')
			const msg = {
				message: '[' + message.author.username + '] ' + message.content,
				type: 'donfuer',
			}
			if (msg.message.length <= 256) {
				ws.send(JSON.stringify(msg))
			}
		}
	}
})

client.login(process.env.BOT_TOKEN)
