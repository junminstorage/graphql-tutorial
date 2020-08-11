'use strict';

function bota (input) {
    return new Buffer(input.toString(), 'binary').toString('base64');
}

function atob (input) {
    return new Buffer(input, 'base64').toString('binary');
}

module.exports = {
    convertNodeToCursor (node) {
        return bota(node.id.toString());
    },


    convertCursorToNodeId (cursor) {
        return parseInt(atob(cursor));
    },


};
