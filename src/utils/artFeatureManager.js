const { WATCHED_ART } = require(`../configs/domain`)
const { required_favs, main_emoji, feature_channel } = require(`../configs/artfeaturing`)

/**
 *  Handles #Featured system
 *  @ClassWrapper
 */
class VoteCollector {
	constructor(Stacks) {
		this.components = { 
			user: Stacks.user, 
			reaction: Stacks.reaction, 
			bot:Stacks.bot, 
			db: Stacks.bot.db,
			message:Stacks.reaction.message, 
			meta: {author:null}
		}
		this.metadata = {
			featured_channel: Stacks.bot.channels.get(feature_channel),
			featured_requirement: required_favs,
			main_emoji: main_emoji,
			msg: Stacks.reaction.message,
			get postComponents() {
				const { artwork, msg:{author, channel}, favs} = this
				return {
					user_id: author.id,
					url: artwork,
					channel_id: channel.id,
					heart_counts: favs,
				}
			},
			async postAlreadyFeatured() {
				const res = await Stacks.bot.db.getFeaturedPostData({url: this.postComponents.url})
				return res[0] ? true : false
			},
			get artwork() {
				return this.msg.attachments.first() ? this.msg.attachments.first().url : null
			},
			get caption() {
				//  Return blank caption
				if (!this.msg.content) return ``
				//  Chop caption with length exceed 180 characters.
				if (this.msg.content.length >= 180) return this.msg.content.substring(0, 180) + `. .`

				return this.msg.content
			},
			get favs() {
				Stacks.reaction.fetchUsers()

				function test() {
					if (Stacks.reaction.users.size > Stacks.reaction.count) {
						return Stacks.reaction.users.size
					} else if (Stacks.reaction.users.size < Stacks.reaction.count) {
						return Stacks.reaction.count
					} else if (Stacks.reaction.users.size == Stacks.reaction.count) {
						return Stacks.reaction.count
					}
				}
				return test()
			},
			get heartsTooLow() {
				return this.favs < this.featured_requirement
			},
			get unmatchEmoji() {
				return Stacks.reaction.emoji.id !== this.main_emoji
			},
			get nonArtChannels() {
				return !WATCHED_ART.includes(this.msg.channel.id)
			},
			get selfLiking() {
				return this.msg.author.id === Stacks.user.id
			},
		}
	}


	/**
	 * 	Updating post's favs count in #featured
	 */
	async updateFavs() {
		
	}


	/**
     *  Register new vote and check for feature
     */
	async Add() {

		//  Calling FranxKits for useful utils
		const { reply, avatar } = require(`../FranxKits/index`)(this.components)
		const { addNewFavPoint, featurePost } = this.components.db


		//  Returns if the reaction is unmatch.
		if (this.metadata.unmatchEmoji) return
		//  Returns if no artwork url was found
		if (!this.metadata.artwork) return 
		//  Returns if current channel is not listed in arts channels.
		if (this.metadata.nonArtChannels) return

        
		//  Store new fav point
		//	Temporarily disabled
		//addNewFavPoint(this.metadata.postComponents)
        

		//  Returns if heart counts are not sufficient.
		if (this.metadata.heartsTooLow) return
		//  Update post's favs count if post already in #featured.
		if (await this.metadata.postAlreadyFeatured()) return this.updateFavs()


		//  Register post metadata
		featurePost(this.metadata.postComponents)

        
		//  Star message as a sign that the post get featured.
		this.metadata.msg.react(`⭐`)


		//  Send post to #featured
		return reply(this.metadata.caption + `\n\u200b`, {
			prebuffer: true,
			image: this.metadata.artwork,
			field: this.metadata.featured_channel,
			customHeader: [this.metadata.msg.author.tag, avatar(this.metadata.msg.author.id)],
			footer: `★ ${this.metadata.favs}`
		}) 
	}
}

module.exports = VoteCollector