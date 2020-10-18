import { AuthenticationError } from 'apollo-server-express'
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import { AppConfig } from '../config'
import { Context } from '../presentation/types/Context'

export const verifyToken = (ctx: Context, token: string) => {
  const {
    config: { jwt: config }
  } = ctx

  const options: VerifyOptions = {
    algorithms: [config.algorithm],
    audience: config.audience,
    issuer: config.issuer
  }

  try {
    const payload = jwt.verify(token, config.secret, options)

    if (typeof payload === 'string') {
      throw new AuthenticationError('Token payload is invalid')
    }

    return payload
  } catch (err) {
    throw new AuthenticationError(err.message)
  }
}

export const createToken = (config: AppConfig['jwt']) => (subject: string, payload: any) => {
  const options: SignOptions = {
    algorithm: config.algorithm,
    audience: config.audience,
    issuer: config.issuer,
    subject,
    expiresIn: config.ttl
  }

  return jwt.sign(payload, config.secret, options)
}

export const getJwtLib = (config: AppConfig['jwt']) => ({
  createToken: createToken(config)
})

export type JwtLib = ReturnType<typeof getJwtLib>
