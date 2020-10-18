import { ApolloError, AuthenticationError } from 'apollo-server-express'
import { Crypto } from '../../lib/crypto'
import { JwtLib } from '../../lib/jwt'
import { UserCreationParams } from '../types/graphql'
import { UserRepository } from './repository'

const login = (repository: UserRepository, crypto: Crypto, jwt: JwtLib) => async (
  usernameOrEmail: string,
  password: string
) => {
  const user = await repository.findByUsernameOrEmail(usernameOrEmail)

  const isPasswordValid = user && crypto.verifyHash(password, user.password)

  if (!user || !isPasswordValid) throw new AuthenticationError('Invalid login or password')

  const { password: _, ...userWithoutPassword } = user

  return jwt.createToken(user._id.toHexString(), userWithoutPassword)
}

const create = (repository: UserRepository, crypto: Crypto) => async (
  userData: UserCreationParams
) => {
  const { name, email, username, password } = userData

  if (await repository.existsByEmail(email)) {
    throw new ApolloError(`user with email ${email} already exists`, 'EMAIL_EXISTS')
  }

  if (await repository.existsByUsername(username)) {
    throw new ApolloError(`user with username ${username} already exists`, 'USERNAME_EXISTS')
  }

  const hashedPassword = crypto.createHash(password)

  await repository.create({
    name,
    email,
    username,
    password: hashedPassword
  })

  return true
}

export const getService = (repository: UserRepository, crypto: Crypto, jwt: JwtLib) => ({
  create: create(repository, crypto),
  login: login(repository, crypto, jwt)
})

export type UserService = ReturnType<typeof getService>
