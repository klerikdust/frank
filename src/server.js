module.exports = async () => {
	const { Client } = require(`discord.js`)
	let Frank = new Client()
	const modulesLoader = require(`./utils/modulesLoader`)
	const express = require(`express`)
	const app = express()

	//  Loads .env variables.
	require(`dotenv`).config()
    
	//	Ping server so it won't died cause of idling.
	app.get(`/`, (request, response) => response.sendStatus(200))
    
	//  To prevent daemon from being terminated.
	await app.listen(process.env.PORT)
    
	//  Load commands.
	Frank = new modulesLoader().register(Frank)

	//  Assign db client to the app
	Frank.db = require(`./db/index`)()

	//  Validate database tables.
	await Frank.db.init({connectionOnly:true})
    
	//  Start events.
	require(`./utils/eventHandler`)(Frank)
    
	//  Login.
	Frank.login(process.env.APP_TOKEN)
}