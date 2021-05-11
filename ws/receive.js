const Discord = require('discord.js')

const receive = (data, client, commandChannelId) => {
	const payload = JSON.parse(data)
	const commandChannel = client.channels.cache.get(commandChannelId)
	const chatChannelId = '800076482357231657'
	const chatChannel = client.channels.cache.get(chatChannelId)
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

		chatChannel.send(combinedMessage)
	}
	if (payload.type === 'playersLength') {
		let numberOfPlayers = payload.playersLength
		client.user.setActivity(`NA with ${numberOfPlayers} online`)
	}
	if (payload.type === 'status_response') {
		let active = payload.activeBots
		let botOneOnline = false
		let botTwoOnline = false
		let botThreeOnline = false
		let botFourOnline = false
		active.forEach(bot => {
			if (bot === process.env.BOT_ONE) {
				botOneOnline = true
			} else if (bot === process.env.BOT_TWO) {
				botTwoOnline = true
			} else if (bot === process.env.BOT_THREE) {
				botThreeOnline = true
			} else if (bot === process.env.BOT_FOUR) {
				botFourOnline = true
			}
		})

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('BOT STATUS')
			.addFields(
				{
					name: process.env.BOT_ONE,
					value: botOneOnline
						? '<:weedman:730908578873081937> **ONLINE**'
						: '<:sheeeiiittt:807282754361360394> OFF',
				},
				{
					name: process.env.BOT_TWO,
					value: botTwoOnline
						? '<:weedman:730908578873081937> **ONLINE**'
						: '<:sheeeiiittt:807282754361360394> OFF',
				},
				{
					name: process.env.BOT_THREE,
					value: botThreeOnline
						? '<:weedman:730908578873081937> **ONLINE**'
						: '<:sheeeiiittt:807282754361360394> OFF',
				},
				{
					name: process.env.BOT_FOUR,
					value: botFourOnline
						? '<:weedman:730908578873081937> **ONLINE**'
						: '<:sheeeiiittt:807282754361360394> OFF',
				}
			)

			.setTimestamp()
			.setFooter('Sponsored by VenomShop')
		commandChannel.send({ embed: exampleEmbed })
	}
}

module.exports = receive
