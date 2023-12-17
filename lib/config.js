"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.projectName = void 0;
var Conf = require('conf');
// tslint:disable: object-literal-key-quotes
var schema = {
    cards: {
        type: 'string',
        default: './cards'
    },
    baseUrl: {
        type: 'string',
        default: 'https://www.dinofan.com/Collectibles/'
    }
};
exports.projectName = 'dinocards';
exports.config = new Conf({
    projectName: exports.projectName,
    schema: schema
});
