const Discord = require('discord.js')

const error = commandChannel => {
	//const commandChannel = client.channels.cache.get(commandChannelId)
	const exampleEmbed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle('<:sheeeiiittt:807282754361360394> Try again <:sheeeiiittt:807282754361360394>')

		.setTimestamp()
	commandChannel.send({ embed: exampleEmbed })
}

module.exports = error
