const collectPost = require(`../utils/collectPost`)
const { WATCHED_ART } = require(`../configs/domain`)

module.exports = (bot, message) => {
	//  Get client from current bot instance
	const { registerPost } = bot.db

	//  Returns true if message has an attachment.
	const attachmentCheck = () => {
		try {
			return message.attachments.first().id ? true : null
		} catch (e) {
			return false
		}
	}

	//  Prevent bot from replying to itself
	if (message.author.bot) return

	//  Conditions before watching the post
	const watchable = WATCHED_ART.includes(message.channel.id) && attachmentCheck()
	const ACmoji = bot.emojis.get(`603638774836232210`)
	if (watchable) return collectPost({ emoji:ACmoji, message, registerPost })




	let prefix = process.env.PREFIX
	let messageArray = message.content.split(` `)
	let cmd = messageArray[0].toLowerCase()
	let args = messageArray.slice(1)
	let command = cmd.slice(prefix.length)
	let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))

	if (!message.content.startsWith(prefix)) return
	if (!commandfile) return

	const Components = {
		bot,
		message,
		command,
		args,
		commandfile
	}
	const cmdHandler = require(`../modules/setComponents`)
	return new cmdHandler(Components).init()
}