module.exports = (bot, message) => {
    if (message.author.bot) return;


    //  Handle direct message type
    if (message.channel.type === 'dm') return dmInterface()

    let prefix = process.env.PREFIX;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    let command = cmd.slice(prefix.length);
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));

    if (!message.content.startsWith(prefix)) return;
    if (!commandfile) return;

    const Components = {
        bot,
        message,
        command,
        args,
        commandfile
    };
    const cmdHandler = require(`../modules/setComponents`);
    return new cmdHandler(Components).init();
}