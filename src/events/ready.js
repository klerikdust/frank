const { feature_channel } = require(`../configs/artfeaturing`)
const fs = require(`fs`)
module.exports = bot => {

	/**
	 * 	Fetching all available channels in #artwork category. Except #featured ones.
	 * 	and store them to config.
	 */
	const fetchWatchedChannels = () => {
		//	Get result and transform into an array
		let result = (Array.from(bot.channels.get(`595741331943587850`).children.keys())).filter(e => e != feature_channel)
		//	Jsonified structure
		let obj = { "WATCHED_ART": result }
		//	Write to disk
		fs.writeFile(`./src/configs/domain.json`, JSON.stringify(obj, null, 4), (err) => {
			//	Handle unexpected err
			if (err) return
			return console.log(`WATCHED_ART : ${result.length} channels.`)
		})
	}

	fetchWatchedChannels()

	console.clear()
	console.log(`${bot.user.username} has successfully login.`)
	bot.user.setStatus(`online`)
	bot.user.setActivity(`Art Club`, {
		type: `LISTENING`
	})

}