const Discord = require('discord.js')
const WebSocket = require('ws')
require('dotenv').config()

const client = new Discord.Client()

const URL = 'ws://localhost:9000'
ws = new WebSocket(URL)

const server_chat_channel_id = '800076482357231657'
const webhook_id = '717064852363018300'

client.once('ready', () => {
	console.log('Discord bot online!')
})

client.on('message', message => {
	// require messages to be in #server_chat
	if (message.channel.id === server_chat_channel_id) {
		// parse messages from webhook bot
		if (message.author.id !== webhook_id) {
			const msg = {
				message: '[' + message.author.username + ']: ' + message.content,
				type: 'na_chat',
			}
			if (msg.message.length <= 256) {
				ws.send(JSON.stringify(msg))
			}
		}
	}
})

client.login(process.env.BOT_TOKEN)
