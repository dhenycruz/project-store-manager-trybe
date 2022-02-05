const sales = require('../services/sales');

const authProduct = async (request, response, next) => {
  const dataRequest = request.body;
  const result = await sales.authProduct(dataRequest);

  if (result !== true) return response.status(result.status).json({ message: result.message });
  next();
};

const authQuantity = (request, response, next) => {
  const dataRequest = request.body;
  const authQuantityResult = sales.authQuantity(dataRequest);
  if (authQuantityResult !== true) {
    return response.status(authQuantityResult.status)
    .json({ message: authQuantityResult.message });
  }
  next();
};

const getAllSales = async (_request, response) => {
  const salesAll = await sales.getAllSales();
  response.status(200).json(salesAll);
};

const getSale = async (request, response) => {
  const { id } = request.params;
  const sale = await sales.getSale(id);
  if (sale === true) return response.status(404).json({ message: 'Sale not found' });
  response.status(200).json(sale);
};

const createSale = async (request, response) => {
  const data = request.body;
  const sale = await sales.createSale(data);
  response.status(201).json(sale);
};

const updateSale = async (request, response) => {
  const data = request.body;
  const { id } = request.params;
  const saleUpdate = await sales.updateSale(id, data);
  response.status(200).json(saleUpdate);
};

module.exports = {
  authProduct,
  authQuantity,
  getAllSales,
  getSale,
  createSale,
  updateSale,
};
