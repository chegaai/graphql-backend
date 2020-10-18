import { Algorithm } from 'jsonwebtoken'
import env from 'sugar-env'

export type AppConfig = {
  mongodb: {
    uri: string
    dbName: string
  }
  jwt: {
    secret: string
    algorithm: Algorithm
    audience: string
    issuer: string
    ttl: string
  }
  crypto: {
    algorithm: string
    key: string
  }
}

export const config: AppConfig = {
  mongodb: {
    uri: env.get('MONGODB_URI', 'mongodb://localhost:27017/chegaai'),
    dbName: env.get('MONGODB_DBNAME', 'chegaai')
  },
  jwt: {
    secret: env.get('JWT_SECRET', 'secret'),
    algorithm: env.get('JWT_ALGORITHM', 'HS512'),
    audience: env.get('JWT_AUDIENCE', 'chegaai:api'),
    issuer: env.get('JWT_ISSUER', 'chegaai:api'),
    ttl: env.get('JWT_TTL', '1h')
  },
  crypto: {
    algorithm: env.get('CRYPTO_ALGORITHM', 'sha512'),
    key: env.get('CRYPTO_KEY', 'secret')
  }
}
