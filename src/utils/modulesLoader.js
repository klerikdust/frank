console.time(`Commands Loaded`)
const { readdir } = require(`fs`)
const { Collection } = require(`discord.js`)

class modulesLoader {
	//	Loading command modules.
	register(Client = {}) {
		Client.commands = new Collection()
		Client.aliases = new Collection()

		readdir(`./src/modules/commands/`, (err, files) => {

			if (err) console.log(err)
			let jsfile = files.filter(f => f.split(`.`).pop() === `js`)
			if (jsfile.length <= 0) {
				console.log(`missing files`)
				return
			}

			jsfile.forEach((f) => {
				let props = require(`../modules/commands/${f}`)
				Client.commands.set(props.help.name, props)
				props.help.aliases.forEach(alias => {
					Client.aliases.set(alias, props.help.name)
				})
			})
		})

		console.timeEnd(`Commands Loaded`)
		return Client
	}
}

module.exports = modulesLoader