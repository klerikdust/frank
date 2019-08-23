module.exports = bot => {
	console.clear()
	console.log(`${bot.user.username} has successfully login.`)
	bot.user.setStatus(`online`)
	bot.user.setActivity(`Art Club`, {
		type: `LISTENING`
	})

}