const model = require('../models/products');

const validateName = async (name) => {
  if (name === '' || name === undefined) {
    return { validate: false, message: '"name" is required', status: 400 };
  }
  if (name.length < 5) {
    return { validate: false,
      message: '"name" length must be at least 5 characters long',
      status: 402,
    };
  }
  const find = await model.findName(name);
  if (find.length >= 1) {
    return { validate: false,
      message: 'Product already exists',
      status: 409,
    };
  }
  return true;
};

const validateQuantity = (quantity) => {
  if (quantity === '' || quantity === undefined) {
    return {
      validate: false,
      message: '"quantity" is required',
      status: 400,
    };
  }

  return true;
};

const getAllProduct = async () => {
  const products = await model.getAllProduct();

  return products;
};

const saveProduct = async (name, quantity) => {
  const authName = await validateName(name);
  const authQuantity = validateQuantity(quantity);
  if (authName !== true) return authName;
  if (authQuantity !== true) return authQuantity;
  const result = await model.saveProduct(name, quantity);
  return {
    validate: true,
    result: { id: result[0].insertId, name, quantity },
  };
};

module.exports = {
  getAllProduct,
  saveProduct,
};
