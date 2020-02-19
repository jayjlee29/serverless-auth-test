'use strict';
const fs = require('fs');
module.exports.getTokenSecret = async (serverless) => {
  const stage = process.env.STAGE?process.env.STAGE:'dev';
  const tokenSecret = fs.readFileSync(`./token_secret.${stage}`, { encoding: 'base64', flag: 'r' })
  return tokenSecret
}