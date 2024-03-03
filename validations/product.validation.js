const joi = require('joi')

// validasi tambah product
exports.validateAddProduct = (product) => {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    description: joi.string().min(3).required(),
    price: joi.number().required(),
    stock: joi.number().required(),
    type: joi.string().min(3).required()
  })

  return schema.validate(product)
}

exports.validateEditProduct = (product) => {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    description: joi.string().min(3).required(),
    price: joi.number().required(),
    stock: joi.number().required(),
    type: joi.string().min(3).required()
  })

  return schema.validate(product)
}