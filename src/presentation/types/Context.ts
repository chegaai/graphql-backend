import { Request, Response } from 'express'
import { AppConfig } from '../../config'
import { UserDbObject } from '../../domain/types/graphql'

export type Context = {
  req: Request
  res: Response
  config: AppConfig
  user: Omit<UserDbObject, 'password'>
}
