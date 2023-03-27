import { type Response } from 'express'

interface IApiResponse {
  res: Response
  status: number
  message: string
  data?: any
  page?: number
  limit?: number
  total?: number
}

export const jsonResponse: (arg0: IApiResponse) => Response = ({
  res,
  status,
  message,
  data
}: IApiResponse) => res.status(status || 200).json({ message, data })

export const paginatedResponse = ({
  res,
  status,
  message,
  data = null,
  page,
  limit,
  total
}: IApiResponse) =>
  res.status(status || 200).json({ message, data, page, limit, total })
