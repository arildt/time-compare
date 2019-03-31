// Creates a concatenated string of a variable number of arguments, used for indexing purposes.
module.exports = (...args) => args.join('_');