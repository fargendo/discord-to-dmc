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
			const msg = '<' + message.author.username + '>' + ' ' + message.content
			ws.send(msg)
		}
	}
})

client.login(process.env.BOT_TOKEN)
