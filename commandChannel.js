const Discord = require('discord.js')
const WebSocket = require('ws')
const receive = require('./ws/receive')
const pm2 = require('pm2')
const error = require('./ws/error')
require('dotenv').config()

const client = new Discord.Client()

const URL = 'ws://localhost:9000'
ws = new WebSocket(URL)

const commandChannelId = '841481657026478170'

const webhookId = '717064852363018300'
const masterAuthorId = '123577074710609924'
const botMasterRole = '849116787223298048'

ws.on('message', function incoming(data) {
	receive(data, client, commandChannelId)
})

client.once('ready', () => {
	console.log('Discord bot online!')
})

client.on('message', message => {
	// require messages to be in #server_chat
	if (!message.guild) return
	if (message.channel.id === commandChannelId) {
		// parse messages from webhook bot
		if (message.author.id !== webhookId) {
			let hasBotMasterRole = false
			if (message.member.roles.cache.has(botMasterRole)) {
				hasBotMasterRole = true
				console.log('has bot master role')
			}
			const content = message.content
			console.log('base message: ' + content)
			if (content.length <= 256 && content.startsWith('!status')) {
				//!status command
				let msg = {
					type: 'status',
				}

				ws.send(JSON.stringify(msg))
			} else if (content.length <= 256 && content.startsWith('!xp')) {
				let botName = message.content.split(' ')
				botName = botName[1].toLowerCase()
				console.log('!xp ' + botName)
				let msg = {
					type: 'xp_level',
					botName: botName,
				}

				ws.send(JSON.stringify(msg))
			}
			//restart
			else if (
				content.length <= 256 &&
				content.startsWith('!restart') &&
				message.author.id == masterAuthorId
			) {
				let botName = message.content.split(' ')
				botName = botName[1].toLowerCase()
				if (!botName) return
				if (
					botName === process.env.BOT_ONE.toLowerCase() ||
					botName === process.env.BOT_TWO.toLowerCase() ||
					botName === process.env.BOT_THREE.toLowerCase() ||
					botName === process.env.BOT_FOUR.toLowerCase()
				) {
					pm2.restart(botName)
				} else {
					const cmdChannel = client.channels.cache.get(commandChannelId)
					error(cmdChannel)
				}
			}
			//stop
			else if (
				content.length <= 256 &&
				content.startsWith('!stop') &&
				message.author.id == masterAuthorId
			) {
				let botName = message.content.split(' ')
				botName = botName[1].toLowerCase()
				if (!botName) return
				console.log(botName)
				if (
					botName === process.env.BOT_ONE.toLowerCase() ||
					botName === process.env.BOT_TWO.toLowerCase() ||
					botName === process.env.BOT_THREE.toLowerCase() ||
					botName === process.env.BOT_FOUR.toLowerCase()
				) {
					let payload = {
						type: 'bot_offline',
						name: botName,
					}
					pm2.stop(botName)
					ws.send(JSON.stringify(payload))
				} else {
					const cmdChannel = client.channels.cache.get(commandChannelId)
					error(cmdChannel)
				}
			}
			//start
			else if (
				content.length <= 256 &&
				content.startsWith('!start') &&
				message.author.id == masterAuthorId
			) {
				let botName = message.content.split(' ')
				botName = botName[1].toLowerCase()
				if (!botName) return
				if (
					botName === process.env.BOT_ONE.toLowerCase() ||
					botName === process.env.BOT_TWO.toLowerCase() ||
					botName === process.env.BOT_THREE.toLowerCase() ||
					botName === process.env.BOT_FOUR.toLowerCase()
				) {
					console.log(botName)
					pm2.start(botName)
				} else {
					const cmdChannel = client.channels.cache.get(commandChannelId)
					error(cmdChannel)
				}
			} else if (
				content.length <= 256 &&
				(content.startsWith('!mute') || content.startsWith('!ignore')) &&
				(message.author.id == masterAuthorId || hasBotMasterRole)
			) {
				let playerName = message.content.split(' ')
				if (!playerName) return

				playerName = playerName[1].toLowerCase()
				console.log(playerName)
				let msg = {
					type: 'player_check',
					playerName: playerName,
				}

				ws.send(JSON.stringify(msg))
			} else if (content.length <= 256 && content.startsWith('!help')) {
				const cmdChannel = client.channels.cache.get(commandChannelId)
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.addFields([
						{
							name: '!status',
							value: 'Gets the status of the bots.',
						},
						{
							name: '!xp <bot>',
							value: 'Gets the xp level of a bot.',
						},
						// {
						// 	name: '!start <name>',
						// 	value: 'Starts the bot.',
						// },
						// {
						// 	name: '!stop <name>',
						// 	value: 'Stops the bot.',
						// },
						// {
						// 	name: '!restart <name>',
						// 	value: 'Restarts the bot.',
						// },
						{
							name: '!mute <name>',
							value: '/ignores a player in game (Bot Master only).',
						},
					])
					.setTitle(`If !status doesn't work then ${process.env.BOT_ONE} is offline.`)
				cmdChannel.send({ embed: exampleEmbed })
			} else {
			}
		}
	}
})

client.login(process.env.BOT_TOKEN)
