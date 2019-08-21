`use-strict`;

  /**
  * Command Handler
  * @param {Object} base_components should have atleast Client/bot and Message Instance object
  */
class CommandHandler {
  constructor(base_components = {}) {
    this.stacks = base_components
    this.filename = this.stacks.commandfile.help.name;
    this.path = `../modules/commands/${this.filename}.js`;
    this.module_parameters = require(this.path).help;
    this.cmd = this.module_parameters.start;
  }

  //  Initialize.
  async init() {
    try {
        return new this.cmd(require(`../FranxKits/index`)(this.stacks)).execute();
    }
    catch (e) {
        console.log(e)
    }
  }
}


module.exports = CommandHandler