const products = require('../services/products');

const authName = (request, response, next) => {
  const { name } = request.body;
  const validateName = products.authName(name);
  if (validateName !== true) {
    return response.status(validateName.status)
    .json({ message: validateName.message });
  }
  next();
};

const authQuantity = (request, response, next) => {
  const { quantity } = request.body;
  const validateQuantity = products.authQuantity(quantity);
  if (validateQuantity !== true) { 
    return response.status(
      validateQuantity.status,
    ).json({ message: validateQuantity.message });
  }
  next();
};

const authAlreadyExists = async (request, response, next) => {
  const { name } = request.body;
  const validateAlreadyExistsProd = await products.alreadyExistsProd(name);
  if (validateAlreadyExistsProd !== true) {
    return response.status(
      validateAlreadyExistsProd.status,
      ).json({
        message: validateAlreadyExistsProd.message,
      });
  }
  next();
};

const authExistsProduct = async (request, response, next) => {
  const { id } = request.params;
  const validateProduct = await products.getProduct(id);
  if (!validateProduct) return response.status(404).json({ message: 'Product not found' });
  next();
};

const getAllProduct = async (_resquest, response) => {
  const productsAll = await products.getAllProduct();
  response.status(200).json(productsAll);
};

const getProduct = async (request, response) => {
  const { id } = request.params;
  const product = await products.getProduct(id);
  if (!product) return response.status(404).json({ message: 'Product not found' }); 
  response.status(200).json(product);
};

const updateProduct = async (request, response) => {
  const { id } = request.params;
  const { name, quantity } = request.body;
  await products.updateProduct(id, request.body);
  response.status(200).json({ id, name, quantity });
};

const saveProduct = async (request, response) => {
  const { name, quantity } = request.body;
  const result = await products.saveProduct(name, quantity);
  if (!result.validate) return response.status(result.status).json({ message: result.message });
  response.status(201).json(result.result);
};

const deleteProduct = async (request, response) => {
  const { id } = request.params;
  const returnProduct = await products.deleteProduct(id);
  response.status(200).json(returnProduct);
};

module.exports = {
  authName,
  authQuantity,
  authAlreadyExists,
  authExistsProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  saveProduct,
  deleteProduct,
};
