const Vote = require(`../utils/artFeatureManager`);

module.exports = async (Components) => {
    new Vote(Components).Add()
}