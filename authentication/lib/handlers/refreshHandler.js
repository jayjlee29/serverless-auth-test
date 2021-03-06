// Config
const { config, utils } = require('serverless-authentication')

// Common
const cache = require('../storage/cacheStorage')
const { createResponseData } = require('../helpers')
const { getTokenSecret } = require('../utils/token')
/**
 * Refresh Handler
 * @param event
 * @param callback
 */
async function refreshHandler(event) {
  const refreshToken = event.refresh_token
  // user refresh token to get userid & provider from cache table
  try {
    const results = await cache.revokeRefreshToken(refreshToken)
    const providerConfig = config({ provider: '', stage: event.stage })
    const { id } = results
    const data = Object.assign(createResponseData(id, providerConfig), {
      refreshToken: results.token
    })
    if (typeof results.payload === 'object') {
      data.authorizationToken.payload = Object.assign(
        data.authorizationToken.payload,
        results.payload
      )
    }

    const tokenSecret = await getTokenSecret(Buffer.from(providerConfig.token_secret, 'base64'))
    const authorization_token = utils.createToken(
      data.authorizationToken.payload,
      tokenSecret,
      data.authorizationToken.options
    )
    return { authorization_token, refresh_token: data.refreshToken, id }
  } catch (exception) {
    return JSON.stringify(exception)
  }
}

module.exports = refreshHandler
