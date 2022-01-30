const model = require('../models/products');

const validateName = (name) => {
  if (name === '' || name === undefined) {
    return { validate: false, message: '"name" is required', status: 400 };
  }
  if (name.length < 5) {
    return { validate: false,
      message: '"name" length must be at least 5 characters long',
      status: 422,
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
  // eslint-disable-next-line no-undef
  if (typeof quantity === 'string' || quantity <= 0) {
    return {
      validate: false,
      message: '"quantity" must be a number larger than or equal to 1',
      status: 422,
    };
  }
  return true;
};

const alreadyExistsProd = async (name) => {
  const find = await model.findName(name);
  if (find.length >= 1) {
    return { validate: false,
      message: 'Product already exists',
      status: 409,
    };
  }
  return true;
};

const getAllProduct = async () => {
  const products = await model.getAllProduct();
  return products;
};

const getProduct = async (id) => {
  const products = await model.getProduct(id);
  if (products.length < 1) {
    return false;
  }
  return products[0];
};

const updateProduct = async (id, product) => {
  await model.updateProduct(id, product);
};

const saveProduct = async (name, quantity) => {
  /* const authName = validateName(name);
  const authQuantity = validateQuantity(quantity);
  if (authName !== true) return authName;
  if (authQuantity !== true) return authQuantity;
  const authAlreadyExists = await alreadyExistsProd(name);
  if (authAlreadyExists !== true) return authAlreadyExists; */

  const result = await model.saveProduct(name, quantity);
  return {
    validate: true,
    result: { id: result[0].insertId, name, quantity },
  };
};

module.exports = {
  validateName,
  validateQuantity,
  alreadyExistsProd,
  getAllProduct,
  getProduct,
  updateProduct,
  saveProduct,
};
