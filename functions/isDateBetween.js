const { isBefore, isAfter, addDays, subDays } = require('date-fns');

module.exports = (date, from, to) => isAfter(addDays(date, 1), from) && isBefore(subDays(date, 1), to);
