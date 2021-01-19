const Discord = require('discord.js')
const WebSocket = require('ws')
require('dotenv').config()

const client = new Discord.Client()

const URL = 'ws://localhost:9000'
ws = new WebSocket(URL)

const server_chat_channel_id = '800076482357231657'
const webhook_id = '717064852363018300'
let numberOfPlayers

ws.on('message', function incoming(data) {
	const payload = JSON.parse(data)
	const channel = client.channels.cache.get(server_chat_channel_id)
	let combinedMessage

	if (payload.type === 'chat') {
		const username = payload.username
		const msg = payload.message
		if (
			(username.startsWith('_') && username.endsWith('_')) ||
			(username.startsWith('__') && username.endsWith('__'))
		) {
			combinedMessage = `<**\\${username}**> ${msg}`
		} else {
			combinedMessage = `<**${username}**> ${msg}`
		}

		channel.send(combinedMessage)
	}
	if (payload.type === 'playersLength') {
		console.log(payload.playersLength)
		numberOfPlayers = payload.playersLength
		client.user.setActivity(`NA with ${numberOfPlayers} online`)
	}
})

client.once('ready', () => {
	console.log('Discord bot online!')
})

client.on('message', message => {
	// require messages to be in #server_chat
	if (message.channel.id === server_chat_channel_id) {
		// parse messages from webhook bot

		if (message.author.id !== webhook_id) {
			console.log('message received from #server_chat')
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
