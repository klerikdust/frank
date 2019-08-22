    
/**
 * Main module
 * @Ping outputing bot ping
 */
 
class Ping {
	constructor(Stacks) {
		this.stacks = Stacks;
	}
	async execute() {
		const { reply, code:{PING}, bot } = this.stacks;
		return reply(PING, {socket: [Math.floor(bot.ping)]})
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