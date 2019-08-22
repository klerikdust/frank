const { RichEmbed, Attachment } = require(`discord.js`);
/**
 *  Micro framework to support Frank's structure
 *  Lightweight, portable and opinionated
 *  @Pistachio
 */
module.exports = (Components) => {
    
    //  Get main components to make the tool works
    let { bot, message } = Components;

    // Initialize default container
    let container = { ...Components };

    //  Get standard locale dialog to be used.
    container.code = require(`../locale/index`).EN

    //  Init color library
    container.palette = require(`../configs/colorset`);

    //  Returns avatar URL based on the id.
    container.avatar = (id) => {
        return bot.users.get(id).displayAvatarURL;
    }

    /** Frank's custom system message.
     *  @param content as the message content
     *  @param {Array} socket is the optional message modifier. Array
     *  @param {ColorResolvable} color for the embed color. Hex code
     *  @param {Object} field as the message field target (GuildChannel/DM). Object
     *  @param {ImageBuffer} image as the attachment url. Buffer
     *  @param {Boolean} simplified as non embed message toggle. Boolean
     *  @param {ImageURL} thumbnail as embed icon. StringuRL
     *  @param {Boolean} notch as huge blank space on top and bottom
     *  @param {ImageBuffer|ImageURL} thumbnail as message icon on top right
     *  @param {Integer} deleteIn as countdown before the message get deleted. In seconds.
     *  @param {Boolean} prebuffer as indicator if parameter supply in "image" already contains image buffer.
     *  @param {String} header use header in an embed.
     *  @param {Array} customHeader First index as header text and second index as header icon.
     */
    container.reply = async (content, options = {
        socket: [],
        color: ``,
        image: null,
        field: message.channel,
        simplified: false,
        notch: false,
        thumbnail: null,
        deleteIn: 0,
        prebuffer: false,
        header: null,
        footer: null,
        customHeader: null
    }) => {
        options.socket = !options.socket ? [] : options.socket;
        options.color = !options.color ? container.palette.darkmatte : options.color;
        options.image = !options.image ? null : options.image;
        options.field = !options.field ? message.channel : options.field;
        options.simplified = !options.simplified ? false : options.simplified;
        options.thumbnail = !options.thumbnail ? null : options.thumbnail;
        options.notch = !options.notch ? false : options.notch;
        options.prebuffer = !options.prebuffer ? false : options.prebuffer;
        options.header = !options.header ? null : options.header;
        options.footer = !options.footer ? null : options.footer;
        options.customHeader = !options.customHeader ? null : options.customHeader

        //  Socketing
        for (let i = 0; i < options.socket.length; i++) {
            if (content.indexOf(`{${i}}`) != -1) content = content.replace(`{${i}}`, options.socket[i]);
        }

        //  Returns simple message w/o embed
        if (options.simplified) return options.field.send(content, options.image ? new Attachment(options.prebuffer ? options.image : await container.loadAsset(options.image)) : null);

        //  Add notch/chin
        if (options.notch) content = `\u200C\n${content}\n\u200C`;


        const embed = new RichEmbed()
            .setColor(options.color)
            .setDescription(content)
            .setThumbnail(options.thumbnail)

        //  Add header
        if(options.header) embed.setAuthor(options.header, container.avatar(message.author.id))

        //  Custom header
        if (options.customHeader) embed.setAuthor(options.customHeader[0], options.customHeader[1])

        //  Add footer
        if (options.footer) embed.setFooter(options.footer);

        //  Add image preview
        if (options.image) {
            embed.attachFile(new Attachment(options.prebuffer ? options.image : await container.loadAsset(options.image), `preview.jpg`))
            embed.setImage(`attachment://preview.jpg`)
        } else if (embed.file) {
            embed.image.url = null;
            embed.file = null
        }


        //  Convert deleteIn parameter into milliseconds.
        options.deleteIn = options.deleteIn * 1000;

        //  If deleteIn parameter was not specified
        if (!options.deleteIn) return options.field.send(embed);

        return options.field.send(embed)
            .then(msg => {
                msg.delete(options.deleteIn)
            })
    }
    
    return container;
}