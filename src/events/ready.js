module.exports = bot => {

    console.log(`Frank has logged in.`)
    bot.user.setStatus('online');
    bot.user.setActivity(`Art Club`, {
        type: "LISTENING"
    });

}