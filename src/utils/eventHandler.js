const reqEvent = (event) => require(`../events/${event}.js`)

module.exports = bot => {
    
    bot.on("ready", async() => reqEvent("ready")(bot));
    bot.on("message", async(message) => reqEvent("message")(bot, message));
}