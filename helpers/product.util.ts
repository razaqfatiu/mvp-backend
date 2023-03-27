import Joi from 'joi'
import { type IProductInput, type IProductSearchParam } from '../interface/product'

export const getDenominations = (num: number): number[] => {
  const denomination = []

  let remainingAmount = num

  while (remainingAmount > 0) {
    switch (true) {
      case remainingAmount >= 100:
        denomination.push(100)
        remainingAmount -= 100
        break
      case remainingAmount >= 50:
        denomination.push(50)
        remainingAmount -= 50
        break
      case remainingAmount >= 20:
        denomination.push(20)
        remainingAmount -= 20
        break
      case remainingAmount >= 10:
        denomination.push(10)
        remainingAmount -= 10
        break
      case remainingAmount >= 5:
        denomination.push(5)
        remainingAmount -= 5
        break
      default:
        break
    }
  }

  return denomination.sort((a, b) => a - b)
}

export const validateNewProd = (body: Partial<IProductInput>) => {
  const schema = Joi.object({
    amountAvailable: Joi.number().required(),
    productName: Joi.string().required(),
    cost: Joi.number().required().multiple(5).messages({
      'number.multiple': 'Cost should be in multiples of 5'
    })
  })
  return schema.validate(body)
}

export const validateFindProd = (body: IProductSearchParam) => {
  const schema = Joi.object({
    id: Joi.string().required()
  })
  return schema.validate(body)
}

export const validatePutProd = (body: Partial<IProductInput>) => {
  const schema = Joi.object({
    amountAvailable: Joi.number(),
    productName: Joi.string(),
    cost: Joi.number()
  })
  return schema.validate(body)
}
