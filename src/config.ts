const Conf = require('conf');

// tslint:disable: object-literal-key-quotes
const schema = {
  cards: {
    type: 'string',
    default: './cards'
  },
  baseUrl: {
    type: 'string',
    default: 'https://www.dinofan.com/Collectibles/'
  }
};

export const projectName = 'dinocards';

export const config = new Conf({
  projectName,
  schema
});