const reqEvent = (event) => require(`../events/${event}.js`)

module.exports = bot => {
    
	let message_cache
	bot.on(`ready`, async() => reqEvent(`ready`)(bot))
	bot.on(`message`, async(message) => {
		message_cache = message
		reqEvent(`message`)(bot, message)
	})
	bot.on(`messageReactionAdd`, async (reaction, user) => reqEvent(`messageReactionAdd`)({bot, reaction, user, message_cache}))
	bot.on(`raw`, async (packet) => reqEvent(`raw`)(bot, packet))
}