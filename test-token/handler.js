

const userClassName = process.env.USERS_CLASS_NAME || 'users' // shared with authentication service
const AWS = require('aws-sdk')
const config = {
  region: 'us-west-1'
}

const dynamodb = new AWS.DynamoDB(config)

const createResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify(payload)
})

module.exports.test = (event, context, cb) => {
  console.log('event', event)
  const authData = event.requestContext.authorizer
  if (authData.principalId) {
    if (dynamodb) {
        getUser(authData.principalId)
        .then((result) => {
          console.log('result', result)
          cb(null, createResponse(200, result))
        })
        .catch((error) => {
          console.log('error', error)
          cb(null, createResponse(400, error))
        })
    } else {
      cb(null, createResponse(200, { username: authData.principalId }))
    }
  } else {
    cb(null, createResponse(400, { error: 'Invalid request' }))
  }
}

const getUser = async (userId) => {
  const params = {
    TableName: process.env.USERS_DB_NAME,
    Key: {
      'userId': {S: userId}
    }
  }

  return dynamodb.getItem(params).promise()
}
