const model = require('../models/sales');
const modelProduct = require('../models/products');

const authProduct = async (dataRequest) => {
  const authFail = { validate: false,
        message: '"product_id" is required',
        status: 400,
  };
  const products = await modelProduct.getAllProduct();
  const authProductBody = dataRequest.some((
    data,
    ) => data.product_id === '' || data.product_id === undefined || data.product_id === null);

  if (authProductBody) return authFail;
  const productsBody = dataRequest.some((data) => {
    const filterProduct = products.filter((el) => data.product_id === el.id);
    if (filterProduct.length < 1) return true;
    return false;
  });

  if (productsBody) return authFail;

  return true;
};

const authQuantity = (dataRequest) => {
  const authQuantityArray = dataRequest.some((
    data,
    ) => data.quantity === '' || data.quantity === undefined);
  if (authQuantityArray) return { validate: false, message: '"quantity" is required', status: 400 };
  
  const authQuantityType = dataRequest.some((
    data,
  ) => typeof data.quantity === 'string' || data.quantity <= 0);
  if (authQuantityType) { 
    return {
      validate: false,
      message: '"quantity" must be a number larger than or equal to 1',
      status: 422,
    };
  }

  return true;
};

const getAllSales = async () => {
  const sales = await model.getAllSales();
  return sales;
};

const getSale = async (id) => {
  const sale = await model.getSale(id);
  if (sale.length < 1) return true;
  return sale;
};

const createSale = async (data) => {
  const sale = await model.createSale(data);
  return sale;
};

const updateSale = async (id, data) => {
  await model.updateSale(id, data);
  return {
    saleId: id,
    itemUpdated: data,
  };
};

const deleteSale = async (id) => {
  const sale = await model.getSale(id);

  if (sale < 1) return true;
  
  await model.deleteSale(id);

  return sale;
};

module.exports = {
  authProduct,
  authQuantity,
  getAllSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
};
