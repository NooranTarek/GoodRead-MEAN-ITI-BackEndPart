const bcrypt = require('bcrypt');

const hashFunction = ({ plainText, saltRounds = process.env.Rounds } = {}) => {
  const hash = bcrypt.hash(plainText, parseInt(saltRounds));
  return hash;
};

const compareFunction = ({ plainText, hash } = {}) => {
  const compare = bcrypt.compare(plainText, hash);
  return compare;
};

module.exports = {
  hashFunction, compareFunction,
};
