const RootMutation = require('./mutation');
const RootQuery = require('./query');
// const bookingRsolver = require('./booking');

// query
// mutation
const rootresolver = {
    RootQuery,
    RootMutation,
}

module.exports = rootresolver;