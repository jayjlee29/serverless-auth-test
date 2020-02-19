const AWS = require('aws-sdk')

const kms = new AWS.KMS({region: 'us-west-1'})
const { utils, config } = require('serverless-authentication')

const authorize = require('../authentication/lib/handlers/authorizeHandler')

describe('Authorization', () => {
  beforeAll(() => {
    process.env.STAGE = 'dev'
    process.env.CACHE_DB_NAME = 'dev-serverless-authentication-cache'
    process.env.REDIRECT_CLIENT_URI = 'http://127.0.0.1:3000/'
    process.env.TOKEN_SECRET = 'AQICAHiXVVVSkUgHjrU32MwdGqx51qVn7q0aux9EGwy0iHVsEQFlXDW8iq6+Eg969T4GyS6uAAAAbDBqBgkqhkiG9w0BBwagXTBbAgEAMFYGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMmkMRxTSmRBoUoT3oAgEQgClF6fiPFs6TcDWa6mKMf2PWo+ezSjpaaJLowNuXXnfJo1UG7IVLyTkuww=='
  })

  describe('Token Secret', () => {
    it('should return decripted token secret', async () => {
      const payload = { id: 'username-123' }
      const providerConfig = config({ provider: '', stage: 'dev' })
      
      const buff = Buffer.from(providerConfig.token_secret, 'base64')

      const tokenSecret = await getTokenSecret(buff)
      console.log('tokenSecret', tokenSecret)
/*
      const authorizationToken = utils.createToken(
        payload,
        tokenSecret
      )
        */
      expect(tokenSecret).toBe('payload.id')
    })
  })
})

const getTokenSecret = async (decodedTokenSecret) => {

  return new Promise((resolve, reject) => {
    const params = {
      CiphertextBlob: decodedTokenSecret
    }
    kms.decrypt(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err)
      } else {
        console.log('decript', data)
        resolve(data.Plaintext.toString('utf-8'))
      }
    })
  })
}