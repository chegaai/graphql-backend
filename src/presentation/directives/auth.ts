import { AuthenticationError, gql, SchemaDirectiveVisitor } from 'apollo-server-express'
import { GraphQLField } from 'graphql'
import { verifyToken } from '../../lib/jwt'
import { Context } from '../types/Context'

export const authDirective = gql`
  directive @auth(required: Boolean = false) on FIELD_DEFINITION
`

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, Context, any>) {
    const { resolve: originalResolve, name: fieldName } = field
    const { required } = this.args

    field.resolve = async (source, args, ctx, info) => {
      const { authorization } = ctx.req.headers

      const [, token] = authorization?.split(' ') || []

      if (required && !token) {
        throw new AuthenticationError(`You must be authenticated to access ${fieldName}`)
      }

      if (!token && !required) {
        return originalResolve?.call(this, source, args, ctx, info)
      }

      const userInfo = verifyToken(ctx, token)

      ctx.user = userInfo

      return originalResolve?.call(this, source, args, ctx, info)
    }
  }
}

export default {
  auth: AuthDirective
}
