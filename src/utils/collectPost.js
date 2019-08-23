module.exports = ({ emoji, message, registerPost }) => {

	let img = message.attachments.first()
	let metadata = {
		user_id: message.author.id,
		url: img.url,
		channel_id: message.channel.id
	}

	//  React to the message
	message.react(emoji)

	//  Update to database
	registerPost(metadata)
}