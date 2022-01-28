const products = require('../services/products');

const getAllProduct = async (_resquest, response) => {
  const productsAll = await products.getAllProduct();
  response.status(200).json(productsAll);
};

const saveProduct = async (request, response) => {
  const { name, quantity } = request.body;
  const result = await products.saveProduct(name, quantity);
  console.log(result);
  if (!result.validate) return response.status(result.status).json(result.message);
  response.status(200).json(result.result);
};

module.exports = {
  getAllProduct,
  saveProduct,
};
