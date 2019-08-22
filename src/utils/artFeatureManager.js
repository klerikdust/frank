const { WATCHED_ART } = require(`../configs/domain`);

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
        };
        this.stacks = require(`../FranxKits/index`)(this.components);
        this.metadata = {
            timestamp: Date.now(),
            featured_channel: Stacks.bot.channels.get("614096377303269410"),
            featured_requirement: 2,
            main_emoji: `❤`,
            msg: Stacks.reaction.message,
            get postComponents() {
                const { artwork, msg:{author, channel}, favs} = this;
                return {
                    author: author.id,
                    url: artwork,
                    channel: channel.id,
                    heart_counts: favs,
                }
            },
            get artwork() {
                return this.msg.attachments.first() ? this.msg.attachments.first().url : null
            },
            get caption() {
                //  Return blank caption
                if (!this.msg.content) return ``
                //  Chop caption with length exceed 180 characters.
                if (this.msg.content.length >= 180) return this.msg.content.substring(0, 180) + `. .`

                return this.msg.content;
            },
            get favs() {
                Stacks.reaction.fetchUsers();

                function test() {
                    if (Stacks.reaction.users.size > Stacks.reaction.count) {
                        return Stacks.reaction.users.size;
                    } else if (Stacks.reaction.users.size < Stacks.reaction.count) {
                        return Stacks.reaction.count;
                    } else if (Stacks.reaction.users.size == Stacks.reaction.count) {
                        return Stacks.reaction.count;
                    }
                }
                return test();
            },
            get heartsTooLow() {
                return this.favs < this.featured_requirement
            },
            get notAuthorizedSandboxUser() {
                return dev && !administrator_id.includes(Stacks.user.id)
            },
            get unmatchEmoji() {
                return Stacks.reaction.emoji.name !== this.main_emoji
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
     *  Register new vote and check for feature
     */
    async Add() {
        //  Mutation pistachio
        const { reply, avatar, reaction, user } = this.stacks


        //  Returns if the reaction is unmatch.
        if (this.metadata.unmatchEmoji) return
        //  Returns if no artwork url was found
        if (!this.metadata.artwork) return 
        //  Returns if current channel is not listed in arts channels.
        if (this.metadata.nonArtChannels) return
        //  Returns if user trying to vote their own post
        //if (this.metadata.selfLiking) return reaction.remove(user)

        console.log(`${this.metadata.msg.author.username}'s work has been liked by ${user.username} in #${this.metadata.msg.channel.name}`)
        //  Store new heart
        //await this.db.addHeart()

        //  Returns if heart counts are not sufficient.
        if (this.metadata.heartsTooLow) return
        //  Returns if post already in #featured
        if (await this.components.db.getFeaturedPostData(this.metadata.artwork)) return
        //  Register post metadata
        await this.components.db.featurePost(this.metadata.postComponents)

        
        //  Send post to #featured
        console.log(`${this.metadata.msg.author.username}'s work has been featured.`)
        return reply(this.metadata.caption + `\n\u200b`, {
            prebuffer: true,
            image: this.metadata.artwork,
            field: this.metadata.featured_channel,
            customHeader: [this.metadata.msg.author.tag, avatar(this.metadata.msg.author.id)]
        }) 
    }
}

module.exports = VoteCollector