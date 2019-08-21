    
/**
 * Main module
 * @Ping outputing bot ping
 */
 
class Ping {
	constructor(Stacks) {
		this.stacks = Stacks;
	}
	async execute() {
		const { reply, bot } = this.stacks;
		return reply(`Request sent in **${Math.floor(bot.ping)} ms**`)
	}
}


module.exports.help = {
	start: Ping,
	name: "ping",
	aliases: ["pong", "p1ng", "poing"],
	description: `Gives bot's ping`,
	usage: `>ping`,
	group: "Server",
	public: true,
}