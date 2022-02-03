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
  const salesAll = sales.getAllSales();
  response.status(200).json(salesAll);
};

const createSale = async (request, response) => {
  const data = request.body;
  const sale = await sales.createSale(data);
  response.status(201).json(sale);
};

module.exports = {
  authProduct,
  authQuantity,
  getAllSales,
  createSale,
};
