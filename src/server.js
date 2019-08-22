module.exports = () => {
    const { Client } = require(`discord.js`)
    let Frank = new Client()
    const modulesLoader = require(`./utils/modulesLoader`)
    const express = require('express')
    const app = express()
    
    //	Ping server so it won't died cause of idling.
    app.get("/", (request, response) => response.sendStatus(200))
    
    //  To prevent PM2 from being terminated.
    const listener = app.listen(process.env.PORT, () => console.log(`Port ${listener.address().port} OK`))

    //  Loads .env variables.
    require(`dotenv`).config()
    
    //  Load commands.
    Frank = new modulesLoader().register(Frank)

    //  Assign key to the app
    Frank.db = require(`./db/index`)

    //  Initialize database
    Frank.db.init()
    
    //  Start events.
    require("./utils/eventHandler")(Frank)
    
    //  Login.
    Frank.login(process.env.APP_TOKEN)
}