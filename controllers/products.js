const products = require('../services/products');

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

const saveProduct = async (request, response) => {
  const { name, quantity } = request.body;
  const result = await products.saveProduct(name, quantity);
  if (!result.validate) return response.status(result.status).json({ message: result.message });
  response.status(201).json(result.result);
};

module.exports = {
  getAllProduct,
  getProduct,
  saveProduct,
};
