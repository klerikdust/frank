module.exports = ({ message, registerPost }) => {

    let img = message.attachments.first()
    let metadata = [
        message.author.id,
        img.url,
        message.channel.id
    ]

    //  React to the message
    message.react(`❤`)

    //  Update to database
    registerPost(metadata)
}